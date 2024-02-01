import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as Sentry from "@sentry/node";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
	beforeSend(event) {
		for (const breadcumb of event.breadcrumbs ?? []) {
			if (breadcumb.data?.url.includes(process.env.ALCHEMY_HTTP_API_URL)) {
				breadcumb.data.url =
					"https://redacted-client-side-url.com/but/this/is/a/polygon/node";
			}
		}

		return event;
	},
	enabled: process.env.SENTRY_DSN !== undefined,
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
