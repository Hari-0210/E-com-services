// Function to generate the SQL INSERT query
function generateInsertQuery(table, data) {
  const columns = data.map((item) => item.key).join(", ");
  const values = data
    .map((item) => {
      return `'${item.value}'`;
    })
    .join(", ");
  return `INSERT INTO ${table} (${columns}) VALUES (${values})`;
}

// Function to generate the SQL UPDATE query
function generateUpdateQuery(table, data, condition) {
  if (!condition || !condition.data || !condition.data.length) {
    throw new Error("Condition with data is required for UPDATE");
  }
  const setClauses = data
    .map((item) => {
      if (item.key === "password") {
        return `${item.key} =  '${hash(item.value)}'`;
      }
      return `${item.key} = '${item.value}'`;
    })
    .join(", ");
  const clauses = condition.data
    .map((item) => `${item.key} = '${item.value}'`)
    .join(` ${condition.operation} `);
  return `UPDATE ${table} SET ${setClauses} WHERE ${clauses}`;
}

// Function to generate the SQL SELECT query
function generateSelectQuery(table, condition) {
  if (!condition || !condition.data || !condition.data.length) {
    return `SELECT * FROM ${table}`;
  }

  const clauses = condition.data
    .map((item) => `${item.key} = '${item.value}'`)
    .join(` ${condition.operation} `);
  return `SELECT * FROM ${table} WHERE ${clauses}`;
}

// Function to generate the SQL DELETE query
function generateDeleteQuery(table, condition) {
  if (!condition || !condition.data || !condition.data.length) {
    throw new Error("Condition with data is required for DELETE");
  }

  const clauses = condition.data
    .map((item) => `${item.key} = '${item.value}'`)
    .join(` ${condition.operation} `);
  return `DELETE FROM ${table} WHERE ${clauses}`;
}

const crudMethod = (method, table, data, condition) => {
  let sql = "";

  switch (method) {
    case "INSERT":
      if (data) {
        sql = generateInsertQuery(table, data);
      } else {
        throw new Error("Data is required for INSERT");
      }
      break;

    case "UPDATE":
      if (condition && data) {
        sql = generateUpdateQuery(table, data, condition);
      } else {
        throw new Error("Condition and data are required for UPDATE");
      }
      break;

    case "SELECT":
      sql = generateSelectQuery(table, condition);
      break;

    case "DELETE":
      if (condition) {
        sql = generateDeleteQuery(table, condition);
      } else {
        throw new Error("Condition is required for DELETE");
      }
      break;

    default:
      throw new Error("Invalid method");
  }
  return sql;
};

module.exports = {
  crudMethod,
};
