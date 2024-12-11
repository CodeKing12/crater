const dbmgr = require("./DBManager");
const db = dbmgr.db;

const readAllBibles = () => {
  try {
    const query = `SELECT * FROM bible`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const insertPerson = (name, age) => {
  try {
    const insertQuery = db.prepare(
      `INSERT INTO bible (name, age) VALUES ('${name}' , ${age})`,
    );

    const transaction = db.transaction(() => {
      const info = insertQuery.run();
      console.log(
        `Inserted ${info.changes} rows with last ID 
                 ${info.lastInsertRowid} into person`,
      );
    });
    transaction();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  readAllPerson,
  insertPerson,
};
