class KGTable{
    constructor(id, hideFlag = false) {
        const _self = this;
        _self.id = id;
        _self.tableId = 0;
        _self.hideFlag = hideFlag;
        $(`#${_self.id}`).html(`<button type="button" class="btn btn-sm btn-primary" id="${_self.id}_addTable"><i class="fas fa-plus"></i> add a table</button><div id="${_self.id}_tables"></div>`);
        $(`#${_self.id}_addTable`).on('click', function() {
            _self.addTable();
        });
        if (hideFlag) {
            $(`#${_self.id}_addTable`).hide();
        }
        // _self.test();
    }
    addTable(cols = 0, rows = 0){
        const _self = this;
        _self.tableId++;
        $(`#${_self.id}_tables`).append(`<div id = "${_self.id}_table${_self.tableId}" class="border mx-2 my-2"></div>`);
        $(`#${_self.id}_table${_self.tableId}`).append(`<form id = "${_self.id}_nameform_${_self.tableId}" class="namearea form-inline p-2"><input type="text" class="form-control" id = "${_self.id}_tableName_${_self.tableId}" value="table${_self.tableId}"><button type="button" class="btn btn-sm btn-danger" id="${_self.id}_dropTable_${_self.tableId}"><i class="fas fa-times"></i> drop this table</button></form>`);
        $(`#${_self.id}_table${_self.tableId}`).append(`<div id = "${_self.id}_ctl_${_self.tableId}" class = "p-2">hoge</div>`);
        $(`#${_self.id}_table${_self.tableId}`).append(`<table id = "${_self.id}_${_self.tableId}_mat" border="1" rows="0" cols="0"  class = "m-2"><tbody><tr><th></th></tr></tbody></table>`);
        $(`#${_self.id}_dropTable_${_self.tableId}`).on('click', function() {
            _self.removeTable($(this).parent().parent().attr('id'));
        });
        let ctl = "";
        ctl += `<button type="button" class="btn btn-sm btn-info" id="${_self.id}_ctl_${_self.tableId}_left"><i class="fas fa-arrow-left"></i> drop last column</button> `;
        ctl += `<button type="button" class="btn btn-sm btn-info" id="${_self.id}_ctl_${_self.tableId}_right"><i class="fas fa-arrow-right"></i> add a column</button> `;
        ctl += `<button type="button" class="btn btn-sm btn-info" id="${_self.id}_ctl_${_self.tableId}_up"><i class="fas fa-arrow-up"></i> drop last row</button> `;
        ctl += `<button type="button" class="btn btn-sm btn-info" id="${_self.id}_ctl_${_self.tableId}_down"><i class="fas fa-arrow-down"></i> add a row</button> `;
        $(`#${_self.id}_ctl_${_self.tableId}`).html(ctl);
        $(`#${_self.id}_ctl_${_self.tableId}_left`).on('click', function() {
            _self.dropCol($(this).parent().parent().find("table").attr('id'));
        });
        $(`#${_self.id}_ctl_${_self.tableId}_right`).on('click', function() {
            _self.addCol($(this).parent().parent().find("table").attr('id'));
        });
        $(`#${_self.id}_ctl_${_self.tableId}_up`).on('click', function() {
            _self.dropRow($(this).parent().parent().find("table").attr('id'));
        });
        $(`#${_self.id}_ctl_${_self.tableId}_down`).on('click', function() {
            _self.addRow($(this).parent().parent().find("table").attr('id'));
        });        
        if (_self.hideFlag) {
            $(`#${_self.id}_nameform_${_self.tableId}`).hide();
            $(`#${_self.id}_ctl_${_self.tableId}`).hide();
        }
        const tableDomId = `${_self.id}_${_self.tableId}_mat`;
        for (let i = 0; i < cols; i++) _self.addCol(tableDomId);
        for (let i = 0; i < rows; i++) _self.addRow(tableDomId);
    }    
    removeTable(tableId) {
        $(`#${tableId}`).remove();
        // console.log("removed : " + tableId);
    }
    dropCol(matId) {
        const $mat = $(`#${matId}`);
        const cols = parseInt($mat.attr("cols"));
        const rows = parseInt($mat.attr("rows"));
        const $tr = $mat.find("tr");
        if (cols === 0)return; 
        for (let y = 0; y <= rows; y++) {
            $($tr.get(y)).find("th").last().remove();
        }
        $mat.attr("cols", "" + (cols - 1));
    }
    addCol(matId) {
        const $mat = $(`#${matId}`);
        const cols = parseInt($mat.attr("cols"));
        const rows = parseInt($mat.attr("rows"));
        const $tr = $mat.find("tr");
        for (let y = 0; y <= rows; y++) {
            if (y === 0) {
                let th = `<th><div class="p2">`;
                th += `<input type="text" class="form-control my-3" value="col${cols + 1}">`;

                th += `<select class="form-control my-3">`;
                th += `<option>INT</option>`;
                th += `<option>VARCHAR(20)</option>`;
                th += `</select>`;
                th += `</div></th>`;
                $(th).appendTo($tr.get(y));
            } else {
                let th = `<th><input type="text" class="form-control"></th>`;
                $(th).appendTo($tr.get(y));
            }
        }
        $mat.attr("cols", "" + (cols + 1));
    }
    dropRow(matId) {
        const $mat = $(`#${matId}`);
        const cols = parseInt($mat.attr("cols"));
        const rows = parseInt($mat.attr("rows"));
        if (rows === 0) return;
        $mat.find("tr").last().remove();
        $mat.attr("rows", "" + (rows - 1));
    }
    addRow(matId) {
        const $mat = $(`#${matId}`);
        const cols = parseInt($mat.attr("cols"));
        const rows = parseInt($mat.attr("rows"));
        let tr = `<tr><th>${rows + 1}</th>`;
        for (let x = 1; x <= cols; x++) {
            tr += `<th><input type="text" class="form-control"></th>`;
        }
        tr += `</tr>`;
        $(tr).appendTo($mat);

        $mat.attr("rows", "" + (rows + 1));
    }

    tableNum() {
        const _self = this;
        return $(`#${_self.id}_tables`).children(`div`).length;
    }    
    tableName(tableNo) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return null; 
        return $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`.namearea`).find(`input`).val();
    }
    tableCols(tableNo) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return null; 
        return parseInt($($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).attr(`cols`));
    }
    tableRows(tableNo) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return null;
        return parseInt($($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).attr(`rows`));
    }
    tableHead(tableNo, colNo) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return {"name": null, "type": null};
        if (colNo < 1 || _self.tableCols(tableNo) < colNo) return {"name": null, "type": null};
        const $th = $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).find(`tr`).first().children(`th`);
        const $name = $($th.get(colNo)).find(`input`).val();
        const $type = $($th.get(colNo)).find(`select`).val();
        return {"name": $name, "type": $type};
    }
    tableBody(tableNo, colNo, rowNo) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return null;
        if (colNo < 1 || _self.tableCols(tableNo) < colNo) return null;
        if (rowNo < 1 || _self.tableRows(tableNo) < rowNo) return null;
        const $th = $($($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).find(`tr`).get(rowNo)).children(`th`);
        return $($th.get(colNo)).find(`input`).val();
    }
    tableDomId(tableNo) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return null; 
        return $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).first().attr(`id`);
    }
    setTableHeadName(tableNo, colNo, name) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return;
        if (colNo < 1 || _self.tableCols(tableNo) < colNo) return;
        const $th = $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).find(`tr`).first().children(`th`);
        $($th.get(colNo)).find(`input`).val(name);
    }
    setTableHeadType(tableNo, colNo, type) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return;
        if (colNo < 1 || _self.tableCols(tableNo) < colNo) return;
        const $th = $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).find(`tr`).first().children(`th`);
        $($th.get(colNo)).find(`select`).val(type);
    }
    setTableHead(tableNo, colNo, name, type) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return;
        if (colNo < 1 || _self.tableCols(tableNo) < colNo) return;
        const $th = $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).find(`tr`).first().children(`th`);
        $($th.get(colNo)).find(`input`).val(name);
        $($th.get(colNo)).find(`select`).val(type);
    }
    setTableBody(tableNo, colNo, rowNo, body) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return;
        if (colNo < 1 || _self.tableCols(tableNo) < colNo) return;
        if (rowNo < 1 || _self.tableRows(tableNo) < rowNo) return;
        const $th = $($($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`table`).find(`tr`).get(rowNo)).children(`th`);
        $($th.get(colNo)).find(`input`).val(body);
    }
    setTableRow(tableNo, rowNo, row) {
        const _self = this;
        for (let i = 0; i < row.length; i++) {
            _self.setTableBody(tableNo, i + 1, rowNo, row[i]);
        }
    }
    setTable(tableNo, table) {
        const _self = this;
        for (let i = 0; i < table.length; i++) {
            _self.setTableRow(tableNo, i + 1, table[i]);
        }
    }
    clearTable() {
        const _self = this;
        $(`#${_self.id}_tables`).empty();
    }
    setTableName(tableNo, name) {
        const _self = this;
        if (tableNo < 1 || _self.tableNum() < tableNo) return null; 
        $($(`#${_self.id}_tables`).children(`div`).get(tableNo - 1)).find(`.namearea`).find(`input`).val(name);
    }
    makeQuery() {
        const _self = this;
        let query = "";
        for (let i = 1; i <= _self.tableNum(); i++) {
            query += `DROP TABLE IF EXISTS ${_self.tableName(i)};\n`;
            query += `CREATE TABLE ${_self.tableName(i)} (`;
            for (let j = 1; j <= _self.tableCols(i); j++) {
                if (j > 1) query += `, `;
                const head = _self.tableHead(i, j);
                query += `${head.name} ${head.type}`;
            }
            query += `);\n`;
            for (let row = 1; row <= _self.tableRows(i); row++) {
                query += `INSERT INTO ${_self.tableName(i)} VALUES(`;
                for (let col = 1; col <= _self.tableCols(i); col++) {
                    if (col > 1) query += `, `;
                    let body = _self.tableBody(i, col, row);
                    if (_self.tableHead(i, col).type === 'VARCHAR(20)') {
                        body = `'${body}'`;
                    }
                    query += `${body}`;
                }
                query += `);\n`;
            } 
        }        
        return query;
    }
    test() {
        const _self = this;
        _self.addTable(2, 3);
        _self.setTableHead(1, 1, "username", "VARCHAR(20)");
        _self.setTableHead(1, 2, "pv", "INT");
        _self.setTable(1, [
            ["user1", "10"],
            ["user2", "20"],
            ["user3", "30"]
        ]);
        console.log(_self.makeQuery());
    }
};