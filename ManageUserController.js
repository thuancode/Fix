
Ext.define('MyApp.controller.ManageUserController', {
    extend: 'Ext.app.Controller',
    requires: [
        'MyApp.util.Util', //#1
        'MyApp.util.Glyphs',
        'CryptoJS.MD5' // Import thư viện để sử dụng MD5

    ],
    stores: [ //#2
        'staticData.ManageUserStore',

    ],
    views: [ //#3
        //'staticData.BaseGrid',
        'staticData.ManageUserView',

    ],

    //alias: 'controller.StaticData',
   
    init: function (application) {  
      
        var me = this;
        me.control({
            'manageUserGrid': {
                render: me.render,
                // sau khi edit nó mới nhảy vào function này
                edit: me.onEdit,
                afterrender: me.onAfterRender,
                widgetclick: me.onWidgetClick
            },
            //event listeners here
            'manageUserGrid button#add': {
                click: me.onButtonClickAdd
            },

            "manageUserGrid actioncolumn": {
                itemclick: this.handleActionColumn
            },

            'manageUserGrid button#save': {
                click: me.onButtonClickSave
            },

            'manageUserGrid button#cancel': {
                click: this.onButtonClickCancel
            },

            'manageUserGrid button#clearFilter': {
                click: this.onButtonClickClearFilter
            },



            //'citiesgrid button#clearGrouping': {
            //    toggle: me.onButtonToggleClearGrouping
            //}
            //// phía trên mới chỉ áp dụng cho bảng Actor, ví dụ để
            //// áp dụng cho bảng khác thì làm tương tự
            //'#staticData.Categories': {
            //    write: this.onStoreSync
            //}

        });

        me.listen({
            store: {
                '#manageUserStore': {
                    write: this.onStoreSync
                }
            }
        });

    },// end init

  
    

    onStoreSync: function (store, operation, options) {
        MyApp.util.Util.showToast('Success! Your changes have been saved.');
    },


    render: function (component, options) {
        // reload lại store để dữ liệu load lên Grid
        component.getStore().load();
        // dòng code này cũng chạy được cùng tác dụng
        //Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().reload();

        //if (component.xtype === 'citiesgrid' && component.features.length > 0) {
        //    if (component.features[0].ftype === 'groupingsummary') {
        //        component.down('toolbar#topToolbar').add([
        //            {
        //                xtype: 'tbseparator'
        //            },
        //            {
        //                xtype: 'button',  
        //                itemId: 'clearGrouping',
        //                text: 'Group by Country: OFF',
        //                glyph: MyApp.util.Glyphs.getGlyph('groupCountry'),
        //                enableToggle: true,
        //                pressed: false
        //            }
        //        ]);
        //    }
        //}
    },
    // sau khi edit nó mới nhảy vào function này
    // param context có thể lấy được model hiện tại (record) đang edit
    onEdit: function (editor, context, options) {

        context.record.set('NgayUpdate', new Date());
        var editedRecord = context.record;

        // Kiểm tra trạng thái CRUD của record để xác định hành động là update hay insert
        var action = editedRecord.crudState;
        if (action === 'C') {
            // Nếu là 'C', tức là record mới được thêm vào
            console.log('Action: Insert');
        } else if (action === 'U') {
            console.log('Updated record data:', editedRecord.getData());

        } else {
            // Trường hợp khác
            console.log('Unknown action');
        }


        context.record.commit();
        // sau khi dòng mới tạo ra validate thì save dòng mới luôn cho chắc
        //store = grid.getstore(), //#2
        //// trước khi save thì validate dữ liệu thêm mới hoặc update lại xem
        //// có đúng ko, nều đúng rồi thì load lại store mới ko thì báo lỗi
        //errors = grid.validate(); //#3
        //// nếu ko có lỗi khi validate
        ////if (errors === undefined) { //#4
        ////    // thì mới cho store sync lại
        ////    // store còn có 1 chức năng autosync, chỉ sử dụng khi
        ////    // grid đó có validate

        ////    store.sync(); //#5

        ////} else {

        ////    ext.msg.alert(errors); //#6
        ////}
    },

    onAfterRender: function (grid, options) {
        var view = grid.getView();
        view.on('itemupdate', function (record, index, node, options) {
            grid.validateRow(record, index, node, options);
        });
    },

    onWidgetClick: function (grid, button) {
        var store = grid.getStore(),
            rec = button.getWidgetRecord();

        store.remove(rec);
    },

    onButtonClickAdd: function (button, e, options) {
        // All components in Ext JS have methods to query other components. They are listed
        // as follows:
        // • up: This navigates up the ownership hierarchy searching for an ancestor
        // container that matches any passed selector or component
        // • down: This retrieves the first descendant of this container that matches
        // the passed selector
        // • query: This retrieves all descendant components that match the
        // passed selector
        // The method query also has some alternatives, such as queryBy(function)
        //and queryById.

        //  the button reference xài up để lấy thành phần cha chứa nút button vừa click
        var grid = button.up('manageUserGrid'); //#1
        var store = grid.getStore(); //#2
        var modelName = store.getModel().getName(); //#3
        // đưa vào param trong getPlugin là pluginId
        // code này để xài cellediting
        //cellEditing = grid.getPlugin('cellplugin'); //#4
        //store.insert(0, Ext.create(modelName, { //#5
        //    last_update: new Date() //#6
        //}));
        //cellEditing.startEditByPosition({ row: 0, column: 1 }); //#7

        // đưa vào param trong getPlugin là pluginId
        // code này là xài roweditting
        var rowEditing = grid.getPlugin('rowEditingplugin'); //#4
        // nếu quyền là mod thì
        if (quyenLoggedIn == "2" || quyenLoggedIn == "4") {
            store.insert(0, Ext.create(modelName, { //#5
                groups_id: "3", //#6
                NgayUpdate: new Date(), //#6
            }));
            rowEditing.startEdit(0, 0);
        } else if (quyenLoggedIn == "1") {// nếu quyền là admin thì
            store.insert(0, Ext.create(modelName, { //#5
             NgayUpdate: new Date(), //#6
            }));
            rowEditing.startEdit(0, 0);
        }
       // rowEditing.sync();
       // rowEditing.startEdit(0, 0)
        // hoặc sử dụng khai báo thêm cellediting và các dòng code sau
        //var cellEditing = grid.getPlugin('cellEditingplugin'); //#4
        //cellEditing.startEditByPosition({ row: 0, column: 1 });
    },

    handleActionColumn: function (column, action, view, rowIndex,
        colIndex, item, e) {
        var store = view.up('manageUserGrid').getStore();
        // lấy index sồ hàng
        var rec = store.getAt(rowIndex);

        if (action == 'delete') {
            // xoá háng dựa theo index của hàng đang chọn
            store.remove(rec);
            Ext.Msg.alert('Delete', 'Save the changes to persist the removed record.');
        }
    },

    onButtonClickSave: function (button, e, options) {
        var grid = button.up('manageUserGrid'), //#1
            store = grid.getStore(), //#2
            // trước khi save thì validate dữ liệu thêm mới hoặc update lại xem
            // có đúng ko, nều đúng rồi thì load lại store mới ko thì báo lỗi
            errors = grid.validate(); //#3

        // nếu ko có lỗi khi validate
        if (errors === undefined) { //#4
            // do insertedRow, updatedRow, removedRow có thể là nhiều dòng do đó ta tạo 
            // 1 list object chứa thông tin các hàng đã thay đổi để xử lý dễ hơn
          
            var listRemovedRow = [];
            var listInsertedRow = [];
            var listUpdatedRow = [];

            // quét xem có bao nhiêu insert row và updatedRow 
            // sau đó add vào list 
            for (var i = 0; i < Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getModifiedRecords().length; i++) {
                if (Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getModifiedRecords()[i].crudState == 'C') {
                    // đẩy mỗi insertedRow vào mảng object (hoặc list object)
                    listInsertedRow.push(Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getModifiedRecords()[i].getData());
                } else if (Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getModifiedRecords()[i].crudState == 'U') {
                    // đẩy mỗi updatedRow vào mảng object (hoặc list object)
                    listUpdatedRow.push(Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getModifiedRecords()[i].getData());
                }
            }

            // quét xem có bao nhiêu remove row sau đó add vào list
            for (var i = 0; i < Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getRemovedRecords().length; i++) {
                // đẩy mỗi removedRow vào mảng object (hoặc list object)
                if (Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getRemovedRecords()[i]) {
                    listRemovedRow.push(Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getRemovedRecords()[i].getData());
                }
            }


            // nếu không có lỗi validate nào thì thêm extraParam vào 
            Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getProxy().extraParams = {
                // stringify để biến list object thành chuỗi(string) để request vào server cho dễ
                // đến server thì deserialize thành list object lại
                userLoggedIn: userLoggedIn,
                idUsersLoggedIn: idUsersLoggedIn,
                listInsertedRow: JSON.stringify(listInsertedRow),
                listUpdatedRow: JSON.stringify(listUpdatedRow),
                listRemovedRow: JSON.stringify(listRemovedRow),
            };
            // rồi sau đó mới cho store sync lại
            // store còn có 1 chức năng autoSync, chỉ sử dụng khi 
            // grid đó có validate
            //store.sync(); //#
            Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().sync({
                // A Ext.data.Batch object(or batch config to apply to the created batch).If unspecified a default batch will be auto- created as needed.
                // batch: Ext.data.Batch / Object(optional)

                // Additional params to send during the sync Operation(s).
                // params: Object(optional)

                // The scope in which to execute any callbacks(i.e.the this object inside the callback,
                // success and/ or failure functions).Defaults to the store's proxy.
                // scope : Object(optional)

                // sau khi nhận response từ server thì nhảy vào đây cho dù có fail hay success
                callback: function (records, operation, success) {
                    console.log('Inserted Rows:', listInsertedRow);
                    console.log('Updated Rows:', listUpdatedRow);
                    console.log('Removed Rows:', listRemovedRow);
                    console.log('in sync callback');
                  
                },
                success: function (batch, options) {

                    //This is where I would like to "refresh" the data in the store with the response from the server...
                    //Ext.getStore('manageUserStoreID').reload();

                    Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().getProxy().setExtraParam("tenQuyenLoggedIn", tenQuyenLoggedIn);
                    Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().reload();

                    // 2 dòng này để khi thay save trong form ManageUser thì cũng refresh bảng
                    // hiện modal thông báo trong 1s là đã Lưu

                    var modalWindow = new Ext.Window({
                        title: "Dữ liệu của bạn đã được lưu thành công",
                        width: 400,
                        //height: 40,
                        //html: "<div id='example'>Dữ liệu của bạn đã được lưu thành công</div> ",
                        listeners: {
                            show: function (window) {
                                window.getEl().setOpacity(0);
                                window.getEl().fadeIn({ duration: 1000 });
                                setTimeout(function () {
                                    window.getEl().fadeOut({ duration: 1000 });
                                }, 1000);

                            },

                        }

                    });
                    modalWindow.show();
                },
                failure: function (batch, options) {
                    console.log('in sync failure');
                },
            }); // end  Ext.ComponentQuery.query("#manageUserViewItemId")[0].getStore().sync function 
        } else { // end if no error
            Ext.Msg.alert(errors); //#6 // nếu có lỗi validate thì báo lỗi , ko cho save
        }
    },

    onButtonClickCancel: function (button, e, options) {
        //button.up('manageUserGrid').getStore().reload();
        if (rowCancelGridManageUser == 0) {
            button.up('manageUserGrid').getStore().reload();
        } else { // if (rowCancelGridManageUser == 1)
            rowCancelGridManageUser = 0;
        }
    },

    onButtonClickClearFilter: function (button, e , options) {
        button.up('manageusergrid').filters.clearfilters();
        var cbbFilterCongTrinhCapNuocHMItem = Ext.ComponentQuery.query("#cbbfiltercongtrinhcapnuochmitemid")[0];
        cbbFilterCongTrinhCapNuocHMItem.setValue(null);
        

    },

    onButtonToggleClearGrouping: function (button, pressed, options) {

        //var store = button.up('citiesgrid').getStore();
        //if (pressed) {
        //    button.setText('Group by Country: ON');
        //    store.group('country_id');
        //} else {
        //    button.setText('Group by Country: OFF');
        //    store.clearGrouping();
        //}                           


    },



});