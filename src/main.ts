import { NestFactory } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import "dotenv/config";
import { AppModule } from "./app.module";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
	beforeSend(event) {
		for (const breadcumb of event.breadcrumbs ?? []) {
			if (breadcumb.data?.url.includes(process.env.ALCHEMY_HTTP_API_URL)) {
				breadcumb.data.url =
					"https://redacted-client-side-url.com/but/this/is/a/avalanche/node";
			}
		}

		return event;
	},
	maxValueLength: 10000,
	enabled: process.env.SENTRY_DSN !== undefined,
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
