import { render } from "solid-js/web";
import Layout from "./Layout";
import RouterComponent from "./Router";

/** Application entry point: mounts the app into the `#root` element. */
async function bootstrap() {
  render(
    () => (
      <RouterComponent
        base={import.meta.env.BASE_URL.replace(/\/$/, "")}
        root={Layout}
      />
    ),
    document.getElementById("root") as HTMLElement,
  );
}

bootstrap();
