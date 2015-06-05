Dump the first 10 rows of all tables to `out.json`

    bfdumpdb test.db --limit 10 > out.json

Dump all rows of the `USERS` and `ROLES` table to `out.json`

    bfdumpdb test.db USERS ROLES > out.json

Dump the first 10 rows of the `USERS` and `ROLES` table to `out.json`

    bfdumpdb test.db USERS ROLES --limit 10 > out.json
