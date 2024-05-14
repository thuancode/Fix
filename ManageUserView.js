Ext.define('MyApp.view.staticData.ManageUserView', {
    extend: 'Ext.ux.LiveSearchGridPanel',
    xtype: 'manageUserGrid', //#1
    itemId: 'manageUserViewItemId',
    requires: [
        'MyApp.store.staticData.ManageUserStore',
        'MyApp.util.Glyphs', //#2
        'MyApp.overrides.grid.column.Action',
        // phải thêm dòng này mới xài RowEdditing được
        'MyApp.view.staticData.RowEditing',
    ],
    store: {
        type: 'manageUserStore',

    },
    reference: 'manageUserGridReference',
    // 3 và 4 để config các hàng luân phiên màu trắng và màu trắng xám
    columnLines: true, //#3
    autoScroll: true,
    viewConfig: {
        stripeRows: true //#4
    },
    initComponent: function () {
        var me = this;
        me.selModel = {
            // selectionType = cellmodel tức edit từng cell trong Grid
            selType: 'cellmodel' //#5
        };
        //docked items
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                itemId: 'topToolbar', //#9
                items: [
                    {
                        xtype: 'button',
                        // itemId này để gọi ra sử dụng phải thêm 
                        // vào loại xtype ví dụ xtype này là button 
                        // thì sử dụng 'staticdatagrid button#add'
                        // với staticdatagrid là xtype của grid
                        itemId: 'add', //#10
                        text: 'Thêm',
                        //glyph: MyApp.util.Glyphs.getGlyph('add'),
                        iconCls: 'fas fa-pencil-alt',
                        style: {
                            //color:'red',
                        },
                        //ui: 'confirm',
                        //glyph: MyApp.util.Glyphs.getIcon('add'),
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'button',
                        itemId: 'save',
                        text: 'Lưu lại',
                        iconCls: 'fas fa-save',
                        
                        //ui: 'confirm',
                        //glyph: MyApp.util.Glyphs.getGlyph('saveAll')
                    },
                    {
                        xtype: 'button',
                        itemId: 'cancel',
                        text: 'Huỷ thay đổi',
                        iconCls: 'fas fa-undo',

                        //ui: 'decline',
                        //glyph: MyApp.util.Glyphs.getGlyph('cancel')
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'button',
                        itemId: 'clearFilter',
                        text: 'Huỷ lọc dữ liệu',
                        iconCls: 'fa fa-filter',
                        //ui: 'decline',
                        //glyph: MyApp.util.Glyphs.getGlyph('clearFilter')
                    },
                    //{
                    //    xtype: 'button', //#12 // tạo nút logout
                    //    itemId: 'crystalReport', //#13
                    //    text: 'Crystal Report',
                    //    //reference: 'crystalReport', //#14
                    //    //iconCls: 'fa fa-sign-out fa-lg buttonIcon', //#15
                    //    //listeners: {
                    //    //    click: 'onRedirectToCrystalReportPage' //#16
                    //    //}
                    //},
                    //{
                    //    xtype: 'button',
                    //    itemId: 'select',
                    //    text: 'Select',
                    //    glyph: MyApp.util.Glyphs.getGlyph('clearFilter'),
                    //    bind: {
                    //        // để sử dụng được tất phải khai báo reference
                    //        disabled: '{!manageUserGridReference.selection}'
                    //    }
                    //},
                ]// hết items của docked
            }
        ];// hết dockedItem

        me.columns = [
            {
                text: 'TT',
                xtype: 'rownumberer',
                width: 80,
                sortable: false,
                //locked: true
            },
            {
                // vì là field id nên ko cho edit ở đây 
                // nên ko khai báo editor
                text: 'ID User',
                width: 70,
                dataIndex: 'id',
                // các type có thể dùng: Base, Boolean, Date, List
                // Number, StringFilter, String, TriFilter
                filter: {
                    type: 'numeric' //#3
                },
                hidden: true,
            },
            {
                text: 'Tên người dùng',
                width: 200,
                cellWrap: true,
                dataIndex: 'name',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    allowBlank: true, //#4
                    maxLength: 100, //#5
                    //listeners: {
                    //    change: function (textField, newValue, oldValue, opts) {
                    //        var tenManageUserStore = Ext.StoreManager.lookup('manageUserStoreID');
                    //        // query vào store apGiaVatLieuNhanCong để tìm được thằng thoả mãn 2 điều kiện
                    //        // là có idVatLieuNhanCong bằng giá trị mới edit và idManageUser giống với cbb trong Grid
                    //        // để load lên đúng record có idApGiaVatLieuNhanCong duy nhất đó trong store 
                    //        // sau đó áp vào giá tiền vật liệu và nhân công
                    //        var tenManageUser = tenManageUserStore.queryBy(function (record, id) {
                    //            // lấy giá trị trả về đúng theo yêu cầu
                    //            return (record.get('TenManageUser').toUpperCase() == newValue.toUpperCase()

                    //            );
                    //        }).items;
                    //        if (tenManageUser.length > 0) {
                    //            textField.setValue(null);
                    //            Ext.Msg.alert('Trùng', 'Tên người dùng này đã có', Ext.emptyFn);
                    //        }

                    //    }, // end function edit
                    //}// end listeners
                },
                filter: {
                    // các type có thể dùng: Base, Boolean, Date, List
                    // Number, StringFilter, String, TriFilter
                    type: 'string' //#6
                }
            },
            {
                text: 'Tên đăng nhập',
                width: 200,
                cellWrap: true,
                dataIndex: 'userName',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    allowBlank: false, //#7
                    maxLength: 100, //#8
                    itemId: 'txtEditorUserNameMUItemID',
                },
                // các type có thể dùng: Base, Boolean, Date, List
                // Number, StringFilter, String, TriFilter
                filter: {
                    type: 'string' //#9
                }
            },
            {
                text: 'Mật khẩu',
                width: 200,
                cellWrap: true,
                dataIndex: 'passwordHash',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    allowBlank: true, //#7
                    maxLength: 200, //#8
                    // lấy từ CustomVtypes.js , đã add vào file Application.js
                    // phải add CustomVtypes.jsvào 2 trang app.json, classic,json và modern.json mới xài được 
                    vtype: 'customPass', 
                },
                // các type có thể dùng: Base, Boolean, Date, List
                // Number, StringFilter, String, TriFilter
                filter: {
                    type: 'string' //#9
                }
            },
            
            {
                text: 'Email',
                cellWrap: true,
                flex: 1,
                //width: 200,
                dataIndex: 'email',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    allowBlank: true, //#7
                    maxLength: 100 //#8
                },
                // các type có thể dùng: Base, Boolean, Date, List
                // Number, StringFilter, String, TriFilter
                filter: {
                    type: 'string' //#9
                }
            },
            {
                text: 'Điện thoại',
                cellWrap: true,
                flex: 1,
                //width: 200,
                dataIndex: 'phoneNumber',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    allowBlank: true, //#7
                    maxLength: 100 //#8
                },
                // các type có thể dùng: Base, Boolean, Date, List
                // Number, StringFilter, String, TriFilter
                filter: {
                    type: 'string' //#9
                }
            },

            {
                text: 'Cấp quyền người dùng',
                width: 230,
                cellWrap: true,
                dataIndex: 'groups_id',
                itemId: 'cbbGridManageGroupMUItemID',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    xtype: 'combobox',
                    forceSelection: true,
                    allowBlank: false,
                    displayField: 'name',
                    valueField: 'id',
                    queryMode: 'local',
                    autoComplete: true,
                    itemId: 'cbbGridEditorManageGroupMUItemID',
                    //editable: false,
                    listConfig: {
                        // nếu muốn display nhiều dữ liệu từ bảng reference hơn thì khai báo itemTpl
                        //itemTpl: '{TenCongTrinh} - {ThuocCumCapNuoc} - {DienThoai}',
                        //displayTpl: '{TenCongTrinh} - {ThuocCumCapNuoc} - {DienThoai}',
                    },
                    //store: Ext.StoreManager.lookup('manageGroupStoreID') ? Ext.StoreManager.lookup('manageGroupStoreID') : Ext.ComponentQuery.query("#manageGroupViewItemId")[0].getStore(),

                    store: Ext.StoreManager.lookup('manageGroupStoreID').queryBy(function (record, id) {

                        // Điều kiện nếu user đăng nhập là moderator hay moderatorSub thì 
                        // cho chọn 2 loại group user là user và userSub
                        if (tenQuyenLoggedIn == "moderator" || tenQuyenLoggedIn == "moderatorSub") {
                            return (record.get('name') == 'user' || record.get('name') == 'userSub');
                        } else {
                            return record.get('name');
                        }

                    }).items,

                },
                // phần render này để hiển thị giá trị display dựa theo ID ra ô Grid
                renderer: function (value, metaData, record) {
                    var groupStore = Ext.StoreManager.lookup('manageGroupStoreID') ? Ext.StoreManager.lookup('manageGroupStoreID') : Ext.ComponentQuery.query("#manageGroupViewItemId")[0].getStore();
                    var group = groupStore.findRecord('id', value);

                    return group != null ? group.get('name') : value;

                }
            },

            {
                text: 'Thuộc Công Trình Cấp Nước',
                width: 200,
                cellWrap: true,
                dataIndex: 'idCongTrinhCapNuoc',
                itemId: 'cbbGridCongTrinhMUItemID',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    xtype: 'combobox',
                    forceSelection: true,
                    allowBlank: true,
                    displayField: 'TenCongTrinh',   
                    valueField: 'idCongTrinhCapNuoc',
                    queryMode: 'local',
                    autoComplete: true,
                    itemId: 'cbbGridEditorCongTrinhMUItemID',
                    //editable: false,
                    listConfig: {
                        // nếu muốn display nhiều dữ liệu từ bảng reference hơn thì khai báo itemTpl
                        //itemTpl: '{TenCongTrinh} - {ThuocCumCapNuoc} - {DienThoai}',
                        //displayTpl: '{TenCongTrinh} - {ThuocCumCapNuoc} - {DienThoai}',
                    },
                    store: Ext.StoreManager.lookup('congTrinhStoreID') ? Ext.StoreManager.lookup('congTrinhStoreID') : Ext.ComponentQuery.query("#congTrinhViewItemId")[0].getStore(),
                    listeners: {
                        //select: function (combobox, recordCbb, index) {
                        //    // đầu tiên phải xét điều kiện nếu như textfield userName trong Grid có giá trị mới làm
                        //    if (Ext.ComponentQuery.query("#txtEditorUserNameMUItemID")[0].value) {
                        //        var manageUserStore = Ext.StoreManager.lookup('manageUserStoreID');
                        //        var listUserName = manageUserStore.queryBy(function (record, id) {
                        //            // thêm điều kiện này bởi vì nếu ko thêm thì trong manageUserStore có 1 record là dòng mới chỉ có NgayUpdate và idHangMuc nên record.get('TenHangMuc') ở record này là undefined
                        //            // có nghĩa là loại dòng mới ra khỏi query đi
                        //            if (record.get('userName')) {
                        //                // lấy giá trị trả về đúng theo yêu cầu
                        //                return (record.get('idCongTrinhCapNuoc') == recordCbb.data.idCongTrinhCapNuoc &&
                        //                    record.get('userName').toUpperCase() == Ext.ComponentQuery.query("#txtEditorUserNameMUItemID")[0].value.toUpperCase()

                        //                );
                        //            }

                        //            //// điều kiện đối với create dòng mới
                        //            ////if (!record.phantom && context.record.data.idHopDong.substring(0, 36) == "MyApp.model.staticData.HopDongModel-") {
                        //            //if (!record.phantom && record.crudStateWas == "C") {
                        //            //    return record.get('TenHangMuc') == context.record.data.TenHangMuc;
                        //            //} else { // nếu đang edit trong dòng cũ ( dòng mới bấm update rồi nhưng chưa save vẫn được tính là dòng cũ )
                        //            //    // nếu trùng với id chính nó thì ko làm gì cả
                        //            //    if (context.newValues.TenHangMuc == context.originalValues.TenHangMuc) {
                        //            //        // do nothing
                        //            //    } else {// nếu khác id của chính nó thì
                        //            //        // Nếu id hàng đang thêm ko trùng với id chính nó trong store ( tức so sánh với hàng khác ) thì
                        //            //        if (record.get('idHangMuc') != context.record.data.idHangMuc) {
                        //            //            return record.get('TenHangMuc') == context.record.data.TenHangMuc;
                        //            //        }
                        //            //    }// end nếu khác id của chính nó thì
                        //            //}// end nếu đang edit trong dòng cũ ( dòng mới bấm update rồi nhưng chưa save vẫn được tính là dòng cũ )



                        //        }).items;
                        //        // điều kiện nếu trong store apGiaVatLieuNhanCong có trả ra 1 vật liệu đã được khai báo có áp giá thoả mãn yêu cầu
                        //        // và ô loại áp giá trong Row đó không phải null thì áp giá vật liệu và nhân công của hàng đó vào idApGiaVatLieuNhanCong
                        //        if (userName.length > 0) {
                        //            combobox.setValue(null);
                        //            Ext.Msg.alert('Trùng', 'Tên userName thuộc Công trình cấp nước này đã có', Ext.emptyFn);
                        //        }
                        //    }// end if Ext.ComponentQuery.query("#cbbGridEditorLoaiApGiaDTQTItemID")[0].value
                        //},// end function select

                    },// end listeners editor cbbGridEditorTenVatLieuNhanCongDTQTItemID

                },
                // phần render này để hiển thị giá trị display dựa theo ID ra ô Grid
                renderer: function (value, metaData, record) {
                    var congTrinhStore = Ext.StoreManager.lookup('congTrinhStoreID') ? Ext.StoreManager.lookup('congTrinhStoreID') : Ext.ComponentQuery.query("#congTrinhViewItemId")[0].getStore();
                    var congTrinh = congTrinhStore.findRecord('idCongTrinhCapNuoc', value);
                    return congTrinh != null ? congTrinh.get('TenCongTrinh') : value;
                }
            },

            {
                text: 'Ghi Chú',
                cellWrap: true,
                flex: 1,
                //width: 200,
                dataIndex: 'description',
                // khai báo editor làm Grid cho phép edit trong field đó 
                editor: {
                    allowBlank: true, //#7
                    maxLength: 200 //#8
                },
                // các type có thể dùng: Base, Boolean, Date, List
                // Number, StringFilter, String, TriFilter
                filter: {
                    type: 'string' //#9
                }
            },


        ]// hết columns
        me.plugins = [
            {
                // thêm plugin cell edit
                // có thể xài roweditting hoặc cellediting
                ptype: 'rowediting', //#6
                // xài double click thì thay 1 thành 2
                clicksToEdit: 2,
                pluginId: 'rowEditingplugin',

                listeners: {
                    // cancel này chạy khi bấm nút Cancel trong RowEditting
                    cancelEdit: function (rowEditing, context) {
                        // Canceling editing of a locally added, unsaved record: remove it
                        var staticdataBaseGrid = Ext.ComponentQuery.query("#manageUserViewItemId")[0];
                        if (context.record.phantom) {
                            staticdataBaseGrid.getStore().remove(context.record);
                            rowCancelGridManageUser = 1;
                        }
                    },

                    beforeEdit: function (editor, context) {
                        var a = 0;

                        //Ext.StoreManager.lookup('manageGroupStoreID').addFilter(
                        //{
                        //    id: 'groupFilter',
                        //    filterFn: function (record) {
                        //        //return e.record.get('shippers').indexOf(this.shipper) != -1;
                        //        //return (record.get('name') == 'user' && record.get('name') == 'userSub');
                        //        return record.get('name') == 'userSub' && record.get('name') == 'user';
                        //    }
                        //})
                        //// Cho Edit nếu là Admin, ko cho Edit nếu là mod, tạm thời bỏ vì có thêm userSub
                        //var gridManageUser = Ext.ComponentQuery.query("#manageUserViewItemId")[0];
                        //// nếu quyenLoggedIn == 2 tức là mod thì khóa edit cột groups_id  lại
                        //// 
                        //if (quyenLoggedIn == "2" || quyenLoggedIn == "4") {
                        //    gridManageUser.getPlugin('rowEditingplugin').editor.form.findField('groups_id').disable();
                        //}
                        //else if (quyenLoggedIn == "1") { // nếu quyenLoggedIn == 1 là admin thì mở ra cho edit
                        //    gridManageUser.getPlugin('rowEditingplugin').editor.form.findField('groups_id').enable();
                        //}
                    },

                    // edit này chạy khi bấm nút Update trong RowEditting
                    edit: function (editor, context) {
                        // lấy itemId grid cha ra luôn, khi áp dụng vào grid con nào
                        // thì grid con sẽ có vài properties khác dùng để phân biệt
                        var staticdataBaseGrid = Ext.ComponentQuery.query("#manageUserViewItemId")[0];
                        if (staticdataBaseGrid) { // nếu staticdataBaseGrid = null thì đang ở các Grid đặc biệt ví dụ ApGia
                            var storeBaseGrid = staticdataBaseGrid.getStore(); //#2
                            // trước khi save thì validate dữ liệu thêm mới hoặc update lại xem
                            // có đúng ko, nều đúng rồi thì load lại store mới ko thì báo lỗi
                            var errors = staticdataBaseGrid.validate(); //#3
                            // nếu ko có lỗi khi validate
                            if (errors === undefined) { //#4

                                // set điều kiện để tìm xem lúc bấm nút Update có Tên UserName nào trùng nhau ko 
                                var listUserNameTrung = storeBaseGrid.queryBy(function (record, id) {
                                    // điều kiện đối với create dòng mới
                                    //if (!record.phantom && context.record.data.idHopDong.substring(0, 36) == "MyApp.model.staticData.HopDongModel-") {
                                    if (!record.phantom && record.crudStateWas == "C") {
                                        return record.get('userName') == context.record.data.TenManageUser;
                                    } else { // nếu đang edit trong dòng cũ ( dòng mới bấm update rồi nhưng chưa save vẫn được tính là dòng cũ )
                                        // nếu trùng với id chính nó thì ko làm gì cả
                                        if (context.newValues.userName == context.originalValues.userName) {
                                            // do nothing


                                        } else {// nếu khác id của chính nó thì
                                            // Nếu id hàng đang thêm ko trùng với id chính nó trong store ( tức so sánh với hàng khác ) thì
                                            if (record.get('id') != context.record.data.id) {
                                                return record.get('userName') == context.record.data.userName;
                                            }
                                        }// end nếu khác id của chính nó thì
                                    }// end nếu đang edit trong dòng cũ ( dòng mới bấm update rồi nhưng chưa save vẫn được tính là dòng cũ )
                                }).items;

                                if (listUserNameTrung.length > 0) {
                                    Ext.Msg.alert('Trùng', 'Tên đăng nhập này đã có', Ext.emptyFn);
                                    storeBaseGrid.remove(context.record);
                                } else {
                                    
                                   
                                    // thì mới cho store sync lại
                                    // store còn có 1 chức năng autoSync, chỉ sử dụng khi 
                                    // grid đó có validate
                                    // commit the changes right after editing finished
                                    context.record.commit();
                                }

                            } else {
                                if (context.record.phantom) {
                                    alert("Dữ liệu nhập không đúng yêu cầu");
                                    storeBaseGrid.remove(context.record);
                                }
                            }
                        }

                    },

                    validateEdit: function (editor, context) {
                        var a = 0;
                    }

                }
            },
            {
                // thêm plugin có grid filter vào Grid
                ptype: 'gridfilters' //#7
            },
            //// thêm plugin cell edit
            //// có thể xài roweditting hoặc cellediting
            //// sử dụng cả cellediting để lúc tạo mới record 
            //// có thể focus thẳng vào record đó luôn
            //{
            //ptype: 'cellediting', //#6
            //// xài double click thì thay 1 thành 2
            ////clicksToEdit: 3,
            //pluginId: 'cellEditingplugin'
            //}, 
        ];

        // columns
        // We want all child grids to have these two columns plus the
        // specific columns for each child grid that why we merge
        me.columns = Ext.Array.merge( //#11
            me.columns, //#12
            [
                {
                    xtype: 'datecolumn',
                    text: 'Ngày cập nhật',
                    width: 135,
                    dataIndex: 'NgayUpdate',
                    format: 'Y-m-j H:i:s',
                    filter: true
                },
                {
                    text: 'Người tạo',
                    width: 150,
                    //cellWrap: true,
                    //flex: 1,
                    //itemId: 'NguoiCreate',
                    dataIndex: 'NguoiCreate',
                    renderer: function (value, metaData, record) {
                        var user = storeUserFull.findRecord('id', value);
                        return user != null ? user.get('name') : value;
                    }
                },
                {
                    xtype: 'datecolumn',
                    text: 'Ngày tạo',
                    width: 135,
                    dataIndex: 'NgayCreate',
                    format: 'Y-m-j H:i:s',
                    filter: true
                },
                {
                    // Delete Button
                    // the only way to have a button inside a 
                    // Grid Column was using an Action Column
                    xtype: 'widgetcolumn', //#13
                    width: 45,
                    sortable: false, //#14
                    menuDisabled: true, //#15
                    itemId: 'delete',
                    widget: {
                        xtype: 'button', //#16
                        iconCls: 'fas fa-trash',
                        tooltip: 'Delete',
                        // me này là scope GridPanel
                        scope: me, //#17
                        // event để đẩy đúng parameter và catch nó trong controller
                        handler: function (btn) { //#18
                            // The btn parameter contains a method named getWidgetRecord
                            // which is used to retrieve the Model represented by the 
                            // GridPanel row where the user clicked on the Delete button
                            me.fireEvent('widgetclick', me, btn);
                        }
                    }
                }
            ]
        );

        // validate mỗi Row
        me.validateRow = function (record, rowIndex) {
            var me = this;
            var view = me.getView();
            // record này là record model
            var errors = record.validate(); //#1
            if (errors.isValid()) { //#2
                return true;
            }
            // getColumnIndexes để lấy mảng số thứ tự của các column
            var columnIndexes = me.getColumnIndexes(); //#3
            //  for each column of the grid that has the editor enabled
            Ext.each(columnIndexes, function (columnIndex, col) { //#4
                var cellErrors, cell, messages;
                // retrieve the errors specific for that column from the Model 
                cellErrors = errors.getByField(columnIndex); //#5
                if (!Ext.isEmpty(cellErrors)) {
                    cell = view.getCellByPosition({
                        row: rowIndex, column: col
                    });
                    messages = [];
                    // add each error message to an array of messages
                    Ext.each(cellErrors, function (cellError) { //#6
                        messages.push(cellError.message);
                    });
                    // add the same error icon from an invalid form field to the grid cell 
                    cell.addCls('x-form-error-msg x-form-invalid-icon xform-invalid-icon-default'); //#7
                    // add a tooltip to the cell with error 
                    cell.set({ //#8
                        'data-errorqtip': Ext.String.format('<ul><li class="last">{0}</li></ul>',
                            messages.join('<br/>'))
                    });
                }
            });

            return false;
        };

        // getColumnIndexes để lấy mảng số thứ tự của các column
        me.getColumnIndexes = function () {
            var me = this;
            var columnIndexes = [];
            // với mỗi cột của lưới
            Ext.Array.each(me.columns, function (column) { //#9
                // xem editor plugin có đang enable hay ko
                if (Ext.isDefined(column.getEditor())) { //#10
                    // nếu cột đó có index thì đẩy vào mảng
                    columnIndexes.push(column.dataIndex); //#11
                } else {
                    columnIndexes.push(undefined);
                }
            });
            // trả lại mảng columnIndexes
            return columnIndexes; //#12
        };

        // validate cả Grid
        me.validate = function () {
            var me = this;
            var isValid = true;
            var view = me.getView();
            var error;
            var record;
            // retrieve all the rows from the grid
            Ext.each(view.getNode(), function (row, col) { //#13
                record = view.getRecord(row);
                // gọi lại validateRow function để check từng row
                isValid = (me.validateRow(record, col) && isValid); //#14
            });
            // nếu bị lỗi thì thông báo ra, ko thì thôi
            // cái này có vẻ hơi sai vì thông báo sau khi chạy hết các row
            // nên ko biết lỗi ở row nào, có thể đưa vào function Ext.each
            // phía trên để ra sai là trả thông báo liền luôn, có thể lúc trả
            // thông báo xong lại phải set null về cho param error
            error = isValid ? undefined : { //#15
                title: "Invalid Records",
                message: "Please fix errors before saving."
            };
            return error; //#16
        };
        // call initConfig from the superclass Ext.ux.LiveSearchGridPanelde
        me.callParent(arguments);
    }
});
