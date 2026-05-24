/**
 * Cache LRU simple en memoria con TTL.
 *
 * Por qué no Redis:
 *  - Para 1 instancia + datos no críticos (dashboard KPIs), in-memory basta.
 *  - Cero infra extra, cero latencia de red.
 *  - Cuando escales horizontal (varias instancias) migrar a Redis.
 *
 * Características:
 *  - TTL por entry (default 60s).
 *  - Tamaño máximo (default 100 keys) con eviction LRU al insertar.
 *  - Hits/misses tracking para métricas.
 */

class TTLCache {
	constructor({ maxSize = 100, defaultTtl = 60_000 } = {}) {
		this.maxSize = maxSize;
		this.defaultTtl = defaultTtl;
		this.store = new Map(); // Map mantiene orden de inserción → LRU básico
		this.hits = 0;
		this.misses = 0;
	}

	get(key) {
		const entry = this.store.get(key);
		if (!entry) {
			this.misses++;
			return undefined;
		}
		if (Date.now() > entry.expiresAt) {
			this.store.delete(key);
			this.misses++;
			return undefined;
		}
		// Refresh LRU position
		this.store.delete(key);
		this.store.set(key, entry);
		this.hits++;
		return entry.value;
	}

	set(key, value, ttl) {
		if (this.store.size >= this.maxSize && !this.store.has(key)) {
			// Evict oldest (first inserted)
			const oldest = this.store.keys().next().value;
			this.store.delete(oldest);
		}
		this.store.set(key, {
			value,
			expiresAt: Date.now() + (ttl ?? this.defaultTtl),
		});
	}

	delete(key) {
		this.store.delete(key);
	}

	clear() {
		this.store.clear();
		this.hits = 0;
		this.misses = 0;
	}

	stats() {
		const total = this.hits + this.misses;
		return {
			size: this.store.size,
			maxSize: this.maxSize,
			hits: this.hits,
			misses: this.misses,
			hitRate: total === 0 ? 0 : Number(((this.hits / total) * 100).toFixed(2)),
		};
	}
}

// Cache global compartido — dashboard usa namespace "dash:"
export const cache = new TTLCache({ maxSize: 200, defaultTtl: 60_000 });

/**
 * Helper: get-or-compute pattern.
 *   const data = await memoize("dash:2024:11", () => getDashboardService(...), 60_000);
 */
export const memoize = async (key, computeFn, ttl) => {
	const cached = cache.get(key);
	if (cached !== undefined) return cached;
	const value = await computeFn();
	cache.set(key, value, ttl);
	return value;
};
