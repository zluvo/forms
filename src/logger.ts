import path from "path";

type Config = {
  name: string;
  version: string;
};

export default class Logger {
  static record(formName: string, errors: Array<string>) {
    if (!process.env.ZlUVO_TOKEN) {
      throw new Error("process.env.ZLUVO_TOKEN is not defined");
    }

    const config: Config = require(path.join(process.cwd(), "package.json"));

    fetch("http://localhost:3000/api/record", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ZLUVO_TOKEN}`,
      },
      body: JSON.stringify({
        time: new Date(),
        project: {
          name: config.name,
          version: config.version,
        },
        form: formName,
        errors: errors,
      }),
    });
  }
}
