import mongoose from "mongoose";

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        const MONGO_URL = "mongodb+srv://admin:ogYGizfwCG7c9gw5@cluster0.lvikbnl.mongodb.net/twitter?retryWrites=true&w=majority";
        mongoose
            .connect(MONGO_URL, { retryWrites: true, w: "majority" })
            .then(() => {
            console.log("Connected to the database");
            })
    }
}

export default new Database();