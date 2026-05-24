import { exportReportService } from "../services/reports-services.js";

export const ExportReport = async (request, response, next) => {
	try {
		const { type, format, date_from, date_to } = request.body;

		const { buffer, filename, contentType } = await exportReportService({
			type,
			format,
			date_from,
			date_to,
		});

		response
			.status(200)
			.set({
				"Content-Type": contentType,
				"Content-Disposition": `attachment; filename="${filename}"`,
				"Content-Length": buffer.length,
			})
			.end(buffer);
	} catch (error) {
		next(error);
	}
};
