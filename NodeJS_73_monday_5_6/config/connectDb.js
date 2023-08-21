const { connect } = require("mongoose");

const connectDb = async () => {
  try {
    const dB = await connect(process.env.MONGO);
    console.log(
      `DB is connected. Name: ${dB.connection.name}. Host: ${dB.connection.host}. Port: ${dB.connection.port}`
        .green.italic.bold
    );
  } catch (error) {
    console.log(error.message.red.bold);
    process.exit(1);
  }
};

module.exports = connectDb;
