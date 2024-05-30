import app from "./src/app.js";
import connect from "./src/connection/conn.js";

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`your app is being listened on port number ${PORT}`);
  connect()
    .then((res) => {
      console.log("database connected successfully", res.connection.host);
    })
    .catch((err) => {
      console.log(err.message);
    });  
});
