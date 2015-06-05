var minimist = require('minimist'),
  Q = require('q'),
  sqlite3 = require('sqlite3');

function select(db, sql) {
  var deferred = Q.defer();

  db.all(sql, function(err, rows) {
    if (err) {
      return deferred.reject(err);
    }

    deferred.resolve(rows);
  });

  return deferred.promise;
}

function getTableNames(db) {
  var sql = 'select name from sqlite_master where type = \'table\'';

  function returnName(rows) {
    return rows.map(function(row) {
      return row.name;
    });
  }

  return select(db, sql).then(returnName);
}

function dumpTable(db, tableName, limit, result) {
  var sql = 'select * from ' + tableName;

  if (limit) {
    sql += ' limit ' + limit;
  }

  function addKey(rows) {
    result[tableName] = rows;
  }

  return select(db, sql).then(addKey);
}

function dumpTables(db, tableNames, limit, result) {
  return Q.all(tableNames.map(function(tableName) {
    return dumpTable(db, tableName, limit, result);
  }));
}

if (process.argv.length < 3) {
  console.error('dump-bf-tables FILE [table1 table2 ...] [--limit LIMIT]');
  return process.exit(1);
}

var args = minimist(process.argv);
var db = new sqlite3.Database(args._[2]);
var tableNames = args._.slice(3);
var result = {};

Q()
  .then(function() {
    if (tableNames.length !== 0) {
      return tableNames;
    }

    return getTableNames(db);
  })
  .then(function(tableNames) {
    return dumpTables(db, tableNames, args.limit, result);
  })
  .then(function() {
    console.log(JSON.stringify(result, null, '  '));
  })
  .fail(function(err) {
    console.error(err);
    process.exit(1);
  })
  .done();
