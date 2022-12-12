var net = require("net");

exports.execSMTP = async (mail) => {
  try {
    const client = new net.Socket();
    let countSuccess = 0;
    const telnetClient = await new Promise((resolve, reject) => {
      client.connect(25, "172.253.118.26", function () {
        console.log("Connected");
        client.write("helo hi\n");
        client.write("mail from: <me@example.com>\n");
        client.write(`rcpt to: <${mail}>\n`);
      });

      client.on("data", function (data) {
        if (/250 /g.test(data.toString())) {
          countSuccess += 1;
        }
        if (/550-5.1.1/g.test(data.toString()) || /451-4.3.0/g.test(data.toString())) {
          resolve(false);
          client.write("quit\n");
        }
        if (countSuccess === 3) {
          resolve(true);
        }
      });

      client.on("close", function () {
        resolve(false);
      });
    });
    return telnetClient;
  } catch (error) {
    console.log("Error exec checker: ", error.message);
    return false;
  }
};
