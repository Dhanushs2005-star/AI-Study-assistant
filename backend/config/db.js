const mongoose = require("mongoose");
const dns = require("dns");

// Fix for Windows / Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("DNS fallback warning:", e.message);
}

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    // Clean up angle brackets if user pasted <password> literally
    if (mongoURI && mongoURI.includes("<") && mongoURI.includes(">")) {
      mongoURI = mongoURI.replace("<", "").replace(">", "");
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
    console.log(`🔗 In MongoDB Compass, connect to your database to view real-time records!\n`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`💡 Tip: If using local MongoDB, use: mongodb://127.0.0.1:27017/StudyAssistant`);
    console.log(`💡 Tip: If using Atlas, ensure your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).`);
  }
};

module.exports = connectDB;
