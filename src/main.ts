import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as Sentry from "@sentry/node";

Sentry.init({
	dsn: "https://0829957158caa4be27c3cb9648a5d520@o4506514324848640.ingest.sentry.io/4506554583613440",
	tracesSampleRate: 1.0,
	beforeSend(event) {
		for (const breadcumb of event.breadcrumbs ?? []) {
			if (breadcumb.data?.url.includes(process.env.ALCHEMY_HTTP_API_URL)) {
				breadcumb.data.url =
					"https://redacted-client-side-url.com/but/its/a/ether/node";
			}
		}

		return event;
	},
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
