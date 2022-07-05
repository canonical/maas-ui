import https from "https";

const fetchMockData = (jsonUrl) =>
  new Promise((resolve, reject) => {
    https
      .get(jsonUrl, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", async () => {
          try {
            await resolve(body);
          } catch (error) {
            reject(error.message);
          }
        });
      })
      .on("error", (error) => {
        reject(error.message);
      });
  });

export default fetchMockData;
