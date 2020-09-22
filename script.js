$(function(){
    const kgtbl1 = new KGTable("kgtbl1");
    const kgtbl2 = new KGTable("kgtbl2");

    kgtbl1.addTable(2, 3);
    kgtbl1.setTableName(1, "pv_table");
    kgtbl1.setTableHead(1, 1, "userid", "VARCHAR(20)");
    kgtbl1.setTableHeadName(1, 2, "pv");
    kgtbl1.setTable(1, [["1", 10], ["3", 30], ["5", 50]]);

    kgtbl1.addTable(2, 5);
    kgtbl1.setTableName(2, "user_table");
    kgtbl1.setTableHead(2, 1, "userid", "VARCHAR(20)");
    kgtbl1.setTableHeadName(2, 2, "age");
    kgtbl1.setTable(2, [["1", 20], ["2", 25], ["3", 30], ["4", 35], ["5", 40]]);
    

    let db;
    initSqlJs({ locateFile: filename => `../dist/${filename}` }).then(function (SQL) {
        db = new SQL.Database();
    });

    document.getElementById('submit').onclick = function () {
        // console.log("1");
        kgtbl2.clearTable();
        // console.log("2");
        const sql = kgtbl1.makeQuery() + document.getElementById('input').value;
        // console.log(sql);
        let result = '', error = '';
        try { result = db.exec(sql); }
        catch (e) { error = e; }
        // console.log(result);
        for (let i = 0; i < result.length; i++) {
            const tableNo = i + 1;
            const cols = result[i].columns.length;
            const rows = result[i].values.length;
            kgtbl2.addTable(cols, rows);
            kgtbl2.setTableName(tableNo, "");
            for (let j = 0; j < cols; j++) {
                kgtbl2.setTableHead(tableNo, j + 1, result[i].columns[j], null);
            }
            kgtbl2.setTable(tableNo, result[i].values);
        }
        // document.getElementById('result').innerHTML = JSON.stringify(result, null, '  ');
        document.getElementById('error').innerHTML = error;
    };
});