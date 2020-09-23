$(function(){

    const editor = ace.edit("editor", {
        theme: "ace/theme/chrome",
        mode: "ace/mode/sql",
        minLines: 15,
        maxLines: 15
    });
    editor.resize();
    editor.session.setMode("ace/mode/sql");

    const kgtbl1 = new KGTable("kgtbl1");
    const kgtbl2 = new KGTable("kgtbl2", true);

    kgtbl1.addTable(2, 3);
    kgtbl1.setTableName(1, "pv_table");
    kgtbl1.setTableHead(1, 1, "userid", "VARCHAR(20)");
    kgtbl1.setTableHeadName(1, 2, "pv");
    kgtbl1.setTable(1, [["user1", 10], ["user3", 30], ["user5", 50]]);

    kgtbl1.addTable(2, 5);
    kgtbl1.setTableName(2, "user_table");
    kgtbl1.setTableHead(2, 1, "userid", "VARCHAR(20)");
    kgtbl1.setTableHeadName(2, 2, "age");
    kgtbl1.setTable(2, [["user1", 20], ["user2", 25], ["user3", 30], ["user4", 35], ["user5", 40]]);
    

    let db;
    initSqlJs({ locateFile: filename => `../dist/${filename}` }).then(function (SQL) {
        db = new SQL.Database();
    });

    document.getElementById('submit').onclick = function () {
        // console.log("1");
        kgtbl2.clearTable();
        // console.log("2");
        const sql = kgtbl1.makeQuery() + editor.getValue();
        $("#logta").val("-- 実行sql\n" + sql);
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
        if (error != '') {
            document.getElementById('error').innerHTML = error;
            $("#nav4").click();
        } else {
            $("#nav2").click();
        }
    };

    $("#upload").on('click', function(){
        $("#nav3").click();
    });
});