import path from "path";

type Config = {
  name: string;
  version: string;
};

export default class Logger {
  static record(formName: string, errors: Array<string>) {
    const config: Config = require(path.join(process.cwd(), "package.json"));
    console.log({
      time: new Date(),
      project: {
        name: config.name,
        version: config.version,
      },
      form: formName,
      errors: errors,
    });
    if (process.env.ZLUVO_TOKEN) {
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
}
