// requires jquery and jstree

/*
* Base method for creating a jstree view control
*
* @param {jquery_selector} jquery selector for target div.
* @param {data} tree node data.
* @param {checked_nodes} nodes to be checked upon initialization.
* @param {open_all} expand tree or not.
* @param {opened_nodes} nodes to be opened/expanded upon initialization.
*/
function createTreeview(jquery_selector, data, checked_nodes, open_all, opened_nodes) {
    $(jquery_selector).jstree({
        'core': {
            'themes': {
                'icons': false
            },
            'data': data
        },
        'checkbox': {
            three_state: false,
            cascade: 'up',
        },
        'plugins': ['checkbox'],
    });

    // expand all children
    $(jquery_selector).on('ready.jstree', function () {
        updateTreeview(jquery_selector, checked_nodes, open_all, opened_nodes);
    });
}


function updateTreeview(jquery_selector, checked_nodes, open_all, opened_nodes) {
    
        if (open_all) {
            $(jquery_selector).jstree('open_all'); // conflict with cascade 'up'
        }
        else if (opened_nodes) {
            opened_nodes.split(",").forEach(function (item) {
                $(jquery_selector).jstree('open_node', item);
            });
        }

        $(jquery_selector).jstree('deselect_all', true);
        if (checked_nodes) {
            checked_nodes.split(",").forEach(function (item) {
                $(jquery_selector).jstree('select_node', item);
            });
        }

        // select all parent nodes in path
        $(jquery_selector).on('select_node.jstree', function (e, data) {
            $(this).jstree('select_node', data.node.parents);
        });
}

/*
* @description: Create a jstree view control for ROP diagnoses.
*
* @param {jquery_selector} jquery selector for target div.
*/
function createTreeviewForRopDiagnosis(jquery_selector, checked_nodes, open_all) {
    var data = [
                {
                    'id': 'D000',
                    'text': '无ROP'
                },
                {
                    'id': 'D001',
                    'text': '视网膜发育不全',
                    'children': [
                          {
                              'id': 'D001.P001',
                              'text': '视网膜发育不全+'
                          },
                          {
                              'id': 'D001.P002',
                              'text': '视网膜发育不全++'
                          },
                          {
                              'id': 'D001.P003',
                              'text': '视网膜发育不全+++'
                          },
                          {
                              'id': 'D001.P102',
                              'text': '视网膜发育不全+~++'
                          },
                          {
                              'id': 'D001.P203',
                              'text': '视网膜发育不全++~+++'
                          }
                    ]
                },
                {
                    'id': 'D002',
                    'text': '早产儿视网膜病变',
                    'children': [
                            {
                                'id': 'D002.A010',
                                'text': 'APROP',
                            },
                            {
                                  'id': 'D002.A001',
                                  'text': '急性期ROP',
                                  'children': [
                                      {
                                          'id': 'D002.A001.Z',
                                          'text': '分区',
                                          'children': [
                                            {
                                                'id': 'D002.A001.Z001',
                                                'text': '1区'
                                            },
                                            {
                                                'id': 'D002.A001.Z002',
                                                'text': '2区'
                                            },
                                            {
                                                'id': 'D002.A001.Z003',
                                                'text': '3区'
                                            },
                                            {
                                                'id': 'D002.A001.Z012',
                                                'text': '1-2区'
                                            },
                                            {
                                                'id': 'D002.A001.Z023',
                                                'text': '2-3区'
                                            },
                                          ]
                                      },
                                      {
                                          'id': 'D002.A001.S',
                                          'text': '分期',
                                          'children': [
                                            {
                                                'id': 'D002.A001.S001',
                                                'text': '1期'
                                            },
                                            {
                                                'id': 'D002.A001.S002',
                                                'text': '2期'
                                            },
                                            {
                                                'id': 'D002.A001.S003',
                                                'text': '3期'
                                            },
                                            {
                                                'id': 'D002.A001.S004',
                                                'text': '4期',
                                                'children': [
                                                    {
                                                        'id': 'D002.A001.S004.A',
                                                        'text': '4A',
                                                    },
                                                    {
                                                        'id': 'D002.A001.S004.B',
                                                        'text': '4B',
                                                    },
                                                ]
                                            },
                                            {
                                                'id': 'D002.A001.S005',
                                                'text': '5期'
                                            },
                                            {
                                                'id': 'D002.A001.S012',
                                                'text': '1-2期'
                                            },
                                            {
                                                'id': 'D002.A001.S023',
                                                'text': '2-3期'
                                            },
                                            {
                                                'id': 'D002.A001.S034',
                                                'text': '3-4期'
                                            },
                                            {
                                                'id': 'D002.A001.S045',
                                                'text': '4-5期'
                                            },
                                          ]
                                      },
                                      {
                                          'id': 'D002.A001.PI',
                                          'text': 'Plus病变(ICROP)',
                                          'children': [
                                              {
                                                  'id': 'D002.A001.PI001',
                                                  'text': 'pre-plus'
                                              },
                                              {
                                                  'id': 'D002.A001.PI002',
                                                  'text': 'plus'
                                              }
                                          ]
                                      },
                                      {
                                          'id': 'D002.A001.P',
                                          'text': 'Plus病变',
                                          'children': [
                                            {
                                                'id': 'D002.A001.P001',
                                                'text': '+'
                                            },
                                            {
                                                'id': 'D002.A001.P002',
                                                'text': '++'
                                            },
                                            {
                                                'id': 'D002.A001.P003',
                                                'text': '+++'
                                            },
                                            {
                                                'id': 'D002.A001.P012',
                                                'text': '+~++'
                                            },
                                            {
                                                'id': 'D002.A001.P023',
                                                'text': '++~+++'
                                            },
                                          ]
                                      },
                                  ]
                            },                           
                           {
                               'id': 'D002.A020',
                               'text': '阈值ROP',
                           },
                           {
                               'id': 'D002.A031',
                               'text': '阈值前期1型ROP',
                           },
                           {
                               'id': 'D002.A032',
                               'text': '阈值前期2型ROP',
                           }
                    ]
                },
                {
                    'id': 'D003',
                    'text': '退行性ROP',
                    'children': [
                    {
                        'id': 'D003.Z001',
                        'text': '周边'
                    },
                    {
                        'id': 'D003.Z002',
                        'text': '后极'
                    }]
                },
                {
                    'id': 'D004',
                    'text': 'ROP术后',
                    'children': [
                    {
                        'id': 'D004.G001',
                        'text': '注药术后',
                        'children': [
                        {
                            'id': 'D004.G001.M001',
                            'text': '雷珠单抗'
                        },
                        {
                            'id': 'D004.G001.M002',
                            'text': '贝伐单抗'
                        },
                        {
                            'id': 'D004.G001.M003',
                            'text': '融合蛋白'
                        }]
                    },
                    {
                        'id': 'D004.G002',
                        'text': '激光术后'
                    },
                    {
                        'id': 'D004.G003',
                        'text': '玻璃体视网膜手术后'
                    },
                    {
                        'id': 'D004.G004',
                        'text': '晶状体切除术后'
                    },
                    {
                        'id': 'D004.G010',
                        'text': '其他'
                    }
                    ]
                },
                {
                    'id': 'D010',
                    'text': '其它诊断',
                    'children': [
                    {
                        'id': 'D010.D101',
                        'text': 'FEVR'
                    },
                    {
                        'id': 'D010.D102',
                        'text': 'PHPV'
                    },
                    {
                        'id': 'D010.D103',
                        'text': '脉络膜缺损'
                    },
                    {
                        'id': 'D010.D104',
                        'text': '视网膜母细胞瘤'
                    },
                    {
                        'id': 'D010.D105',
                        'text': '牵牛花综合征'
                    },
                    {
                        'id': 'D010.D106',
                        'text': 'Norries病'
                    },
                    {
                        'id': 'D010.D107',
                        'text': 'Coats病'
                    },
                    {
                        'id': 'D010.D108',
                        'text': '周边视网膜下渗出'
                    },
                    {
                        'id': 'D010.D109',
                        'text': '视网膜出血'
                    },
                    {
                        'id': 'D010.D111',
                        'text': '视网膜脱离'
                    },
                    {
                        'id': 'D010.D112',
                        'text': '白内障'
                    },
                    {
                        'id': 'D010.D113',
                        'text': 'Rb'
                    },
                    {
                        'id': 'D010.D114',
                        'text': '排查Rb'
                    },
                    {
                        'id': 'D010.D115',
                        'text': '眼球震颤'
                    },
                    {
                        'id': 'D010.D116',
                        'text': '早产儿'
                    },
                    {
                        'id': 'D010.D117',
                        'text': '先天性视网膜劈裂症'
                    },
                    {
                        'id': 'D010.D122',
                        'text': '先天性视网膜色素上皮肥大'
                    },
                    {
                        'id': 'D010.D118',
                        'text': '视网膜有髓神经纤维'
                    },
                    {
                        'id': 'D010.D119',
                        'text': '白化病眼底'
                    },
                    {
                        'id': 'D010.D120',
                        'text': '豹纹状眼底'
                    },
                    {
                        'id': 'D010.D121',
                        'text': '视网膜色素变性'
                    },
                    {
                        'id': 'D010.D123',
                        'text': '卵黄样黄斑营养不良'
                    },
                    {
                        'id': 'D010.D124',
                        'text': '先天性白内障'
                    },
                    {
                        'id': 'D010.D125',
                        'text': '瞳孔残膜'
                    },
                    {
                        'id': 'D010.D110',
                        'text': '其它'
                    }
                    ]
                },
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}

/**
* Get a human-readable diagnosis text from tree view.
*
* @param {jquery_selector} jquery selector for target div.
*/
function getHumanReadableRopDiagnosisFromTreeView(jquery_selector)
{
    // $().jstree(true) means to get an existing instance (will not create new instance)
    var ids = $(jquery_selector).jstree(true).get_selected();

    ids.remove(["D002.A001.Z", "D002.A001.S", "D010"], true);

    if (ids.some(function (item) {
        return item.contains("D001.");
    })) {
        ids.remove(["D001"], true);
    }

    if (ids.some(function (item) {
        return item.contains("D002."); // if contains children nodes of ROP, remove ROP node itself
    })) {
        ids.remove(["D002"], true);
    }

    if (ids.some(function (item) {
        return item.contains("D002.A001.P0"); // if contains children nodes of Plus, remove Plus node itself
    })) {
        ids.remove(["D002.A001.P"], true);
    }

    if (ids.some(function (item) {
        return item.contains("D004."); // if contains children nodes of ROP术后, remove ROP术后 node itself
    })) {
        ids.remove(["D004"], true);
    }

    var text = "";

    var nodes = $(jquery_selector).jstree(true).get_checked(true);

    function compare(a, b) {
        var aid = a.id;
        var bid = b.id;

        if ((typeof aid === 'string' || aid instanceof String) &&
            (typeof bid === 'string' || bid instanceof String) &&
            aid.startWith("D002.A001.") &&
            bid.startWith("D002.A001.")) {
            aid = ["D002.A001.Z", "D002.A001.S", "D002.A001.P"].indexOf(aid.slice(0, 11));
            bid = ["D002.A001.Z", "D002.A001.S", "D002.A001.P"].indexOf(bid.slice(0, 11));
        }

        if (aid < bid)
            return -1;
        if (aid > bid)
            return 1;
        return 0;
    }
    nodes.sort(compare);

    var encounter = false;
    $.each(nodes, function (i, n) {
        if (ids.contains(n.id)) {
            if (n.id.startWith("D002")) {
                if (encounter == true) {
                    text += n.text;
                }
                else {
                    text += "," + n.text;
                }
                encounter = true;
            }
            else {
                text += "," + n.text;
                encounter = false;
            }
        }
    });

    if (text.startWith(",")) {
        text = text.slice(1);
    }

    return text;
}

/**
* Create a jstree view control for ROP treatment.
*
* @param {jquery_selector} jquery selector for target div.
*/
function createTreeviewForRopTreatment(jquery_selector, checked_nodes, open_all) {
    var data = [
                {
                    'id': 'T001',
                    'text': '定期复查',
                    'children': [
                    {
                        'id': 'T001.N',
                        'text': '周期',
                        'children': [
                          {
                              'id': 'T001.N001',
                              'text': '1'
                          },
                          {
                              'id': 'T001.N002',
                              'text': '2'
                          },
                          {
                              'id': 'T001.N003',
                              'text': '3'
                          },
                          {
                              'id': 'T001.N004',
                              'text': '4'
                          },
                          {
                              'id': 'T001.N005',
                              'text': '5'
                          },
                          {
                              'id': 'T001.N006',
                              'text': '6'
                          },
                          {
                              'id': 'T001.N007',
                              'text': '7'
                          },
                          {
                              'id': 'T001.N008',
                              'text': '8'
                          },
                          {
                              'id': 'T001.N009',
                              'text': '9'
                          },
                          {
                              'id': 'T001.N00A',
                              'text': '10'
                          },
                          {
                              'id': 'T001.N00B',
                              'text': '11'
                          },
                          {
                              'id': 'T001.N00C',
                              'text': '12'
                          },
                          {
                              'id': 'T001.N012',
                              'text': '1-2'
                          },
                          {
                              'id': 'T001.N023',
                              'text': '2-3'
                          },
                          {
                              'id': 'T001.N034',
                              'text': '3-4'
                          },
                          {
                              'id': 'T001.N045',
                              'text': '4-5'
                          },
                          {
                              'id': 'T001.N046',
                              'text': '4-6'
                          },
                          {
                              'id': 'T001.N056',
                              'text': '5-6'
                          },
                          {
                              'id': 'T001.N035',
                              'text': '3-5'
                          },
                          {
                              'id': 'T001.N036',
                              'text': '3-6'
                          },
                          {
                              'id': 'T001.N100',
                              'text': '半'
                          },
                        ]
                    },
                    {
                        'id': 'T001.TM',
                        'text': '',
                        'children': [
                        {
                            'id': 'T001.TM01',
                            'text': '年'
                        },
                        {
                            'id': 'T001.TM02',
                            'text': '月'
                        },
                        {
                            'id': 'T001.TM03',
                            'text': '周'
                        },
                        {
                            'id': 'T001.TM04',
                            'text': '日'
                        },
                        {
                            'id': 'T001.TM11',
                            'text': '岁'
                        },
                        ]
                    },
                    ]
                },
                {
                    'id': 'T011',
                    'text': '长期随诊' // 長期的なフォロー アップ, Long-term follow-up
                },
                {
                    'id': 'T002',
                    'text': '激光光凝术'
                },
                {
                    'id': 'T004',
                    'text': '玻璃体腔注药术',
                    'children': [
                        {
                            'id': 'T004.M001',
                            'text': '玻璃体腔注药术（雷珠单抗）'
                        },
                        {
                            'id': 'T004.M002',
                            'text': '玻璃体腔注药术（贝伐单抗）'
                        },
                        {
                            'id': 'T004.M003',
                            'text': '玻璃体腔注药术（融合蛋白）'
                        }]
                },
                {
                    'id': 'T003',
                    'text': '玻璃体视网膜手术',
                },
                {
                    'id': 'T005',
                    'text': 'RetCam荧光素血管造影',
                },
                {
                    'id': 'T012',
                    'text': '双目间接镜',
                },
                {
                    'id': 'T006',
                    'text': '验光',
                    'children': [
                    {
                        'id': 'T006.000',
                        'text': '即可',
                    },
                    {
                        'id': 'T006.N',
                        'text': '周期',
                        'children': [
                    {
                        'id': 'T006.N001',
                        'text': '1'
                    },
                    {
                        'id': 'T006.N002',
                        'text': '2'
                    },
                    {
                        'id': 'T006.N003',
                        'text': '3'
                    },
                    {
                        'id': 'T006.N004',
                        'text': '4'
                    },
                    {
                        'id': 'T006.N005',
                        'text': '5'
                    },
                    {
                        'id': 'T006.N006',
                        'text': '6'
                    },
                    {
                        'id': 'T006.N007',
                        'text': '7'
                    },
                    {
                        'id': 'T006.N008',
                        'text': '8'
                    },
                    {
                        'id': 'T006.N009',
                        'text': '9'
                    },
                    {
                        'id': 'T006.N00A',
                        'text': '10'
                    },
                    {
                        'id': 'T006.N00B',
                        'text': '11'
                    },
                    {
                        'id': 'T006.N00C',
                        'text': '12'
                    },
                    {
                        'id': 'T006.N012',
                        'text': '1-2'
                    },
                    {
                        'id': 'T006.N023',
                        'text': '2-3'
                    },
                    {
                        'id': 'T006.N034',
                        'text': '3-4'
                    },
                    {
                        'id': 'T006.N045',
                        'text': '4-5'
                    },
                    {
                        'id': 'T006.N046',
                        'text': '4-6'
                    },
                    {
                        'id': 'T006.N056',
                        'text': '5-6'
                    },
                    {
                        'id': 'T006.N035',
                        'text': '3-5'
                    },
                    {
                        'id': 'T006.N036',
                        'text': '3-6'
                    },
                    {
                        'id': 'T006.N100',
                        'text': '半'
                    },
                        ]
                    },
                    {
                        'id': 'T006.TM',
                        'text': '',
                        'children': [
                    {
                        'id': 'T006.TM01',
                        'text': '年'
                    },
                    {
                        'id': 'T006.TM02',
                        'text': '月'
                    },
                    {
                        'id': 'T006.TM03',
                        'text': '周'
                    },
                    {
                        'id': 'T006.TM04',
                        'text': '日'
                    },
                    {
                        'id': 'T006.TM11',
                        'text': '岁'
                    },
                        ]
                    },
                    ]
                },
                {
                    'id': 'T007',
                    'text': '基因鉴定',
                    'children': [
                        {
                            'id': 'T007.B001',
                            'text': '基因鉴定（唾液）'
                        },
                        {
                            'id': 'T007.B002',
                            'text': '基因鉴定（口腔刮片）'
                        },
                        {
                            'id': 'T007.B003',
                            'text': '基因鉴定（血液）'
                        },
                    ]
                },
                {
                    'id': 'T008',
                    'text': '代谢组学检查',
                },
                {
                    'id': 'T009',
                    'text': '会诊',
                    'children': [
                        {
                            'id': 'T009.B001',
                            'text': '本院会诊'
                        },
                        {
                            'id': 'T009.B002',
                            'text': '外院会诊'
                        },
                    ]
                },
                {
                    'id': 'T010',
                    'text': '影像',
                    'children': [
                        {
                            'id': 'T010.IM01',
                            'text': 'CT'
                        },
                        {
                            'id': 'T010.IM02',
                            'text': '核磁共振'
                        },
                        {
                            'id': 'T010.IM03',
                            'text': '角膜地形图'
                        },
                        {
                            'id': 'T010.IM04',
                            'text': '眼底彩照'
                        },
                        {
                            'id': 'T010.IM05',
                            'text': 'OCT'
                        },
                        {
                            'id': 'T010.IM06',
                            'text': '人工晶体度数测量'
                        },
                        {
                            'id': 'T010.IM07',
                            'text': '眼外观照'
                        },
                        {
                            'id': 'T010.IM08',
                            'text': 'VEP'
                        },
                        {
                            'id': 'T010.IM09',
                            'text': 'B超'
                        },
                        {
                            'id': 'T010.IM10',
                            'text': 'ERG'
                        },
                        {
                            'id': 'T010.IM11',
                            'text': 'RetCam照相'
                        },
                        {
                            'id': 'T010.IM12',
                            'text': 'SLO'
                        },
                        {
                            'id': 'T010.IM30',
                            'text': '全麻'
                        },
                    ]
                },
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}

/**
* Create a jstree view control for ROP treatment. English Edition
*
* @param {jquery_selector} jquery selector for target div.
*/
function createTreeviewForRopTreatmentEn(jquery_selector, checked_nodes, open_all) {
    var data = [
                {
                    'id': 'T001',
                    'text': 'Regular Follow-up',
                    'children': [
                    {
                        'id': 'T001.N',
                        'text': 'Every',
                        'children': [
                          {
                              'id': 'T001.N001',
                              'text': '1'
                          },
                          {
                              'id': 'T001.N002',
                              'text': '2'
                          },
                          {
                              'id': 'T001.N003',
                              'text': '3'
                          },
                          {
                              'id': 'T001.N004',
                              'text': '4'
                          },
                          {
                              'id': 'T001.N005',
                              'text': '5'
                          },
                          {
                              'id': 'T001.N006',
                              'text': '6'
                          },
                          {
                              'id': 'T001.N007',
                              'text': '7'
                          },
                          {
                              'id': 'T001.N008',
                              'text': '8'
                          },
                          {
                              'id': 'T001.N009',
                              'text': '9'
                          },
                          {
                              'id': 'T001.N00A',
                              'text': '10'
                          },
                          {
                              'id': 'T001.N00B',
                              'text': '11'
                          },
                          {
                              'id': 'T001.N00C',
                              'text': '12'
                          },
                          {
                              'id': 'T001.N012',
                              'text': '1-2'
                          },
                          {
                              'id': 'T001.N023',
                              'text': '2-3'
                          },
                          {
                              'id': 'T001.N034',
                              'text': '3-4'
                          },
                          {
                              'id': 'T001.N045',
                              'text': '4-5'
                          },
                          {
                              'id': 'T001.N046',
                              'text': '4-6'
                          },
                          {
                              'id': 'T001.N056',
                              'text': '5-6'
                          },
                          {
                              'id': 'T001.N035',
                              'text': '3-5'
                          },
                          {
                              'id': 'T001.N036',
                              'text': '3-6'
                          },
                          {
                              'id': 'T001.N100',
                              'text': 'Half'
                          },
                        ]
                    },
                    {
                        'id': 'T001.TM',
                        'text': '',
                        'children': [
                        {
                            'id': 'T001.TM01',
                            'text': 'Year'
                        },
                        {
                            'id': 'T001.TM02',
                            'text': 'Month'
                        },
                        {
                            'id': 'T001.TM03',
                            'text': 'Week'
                        },
                        {
                            'id': 'T001.TM04',
                            'text': 'Day'
                        },
                        {
                            'id': 'T001.TM11',
                            'text': 'Age'
                        },
                        ]
                    },
                    ]
                },
                {
                    'id': 'T011',
                    'text': 'Long-term Follow-up' // 長期的なフォロー アップ, Long-term follow-up
                },
                {
                    'id': 'T002',
                    'text': 'Laser Photocoagulation'
                },
                {
                    'id': 'T004',
                    'text': 'Intravitreal Injection',
                    'children': [
                        {
                            'id': 'T004.M001',
                            'text': 'Ranibizumab'
                        },
                        {
                            'id': 'T004.M002',
                            'text': 'Bevacizumab'
                        },
                        {
                            'id': 'T004.M003',
                            'text': 'Fusion Protein'
                        }]
                },
                {
                    'id': 'T003',
                    'text': 'Vitreoretinal Surgery',
                },
                {
                    'id': 'T005',
                    'text': 'Binocular Indirect Ophthalmoscopy',
                },
                {
                    'id': 'T012',
                    'text': '双目间接镜',
                },
                {
                    'id': 'T006',
                    'text': 'optometry',
                    'children': [
                    {
                        'id': 'T006.000',
                        'text': 'Once',
                    },
                    {
                        'id': 'T006.N',
                        'text': 'Every',
                        'children': [
                    {
                        'id': 'T006.N001',
                        'text': '1'
                    },
                    {
                        'id': 'T006.N002',
                        'text': '2'
                    },
                    {
                        'id': 'T006.N003',
                        'text': '3'
                    },
                    {
                        'id': 'T006.N004',
                        'text': '4'
                    },
                    {
                        'id': 'T006.N005',
                        'text': '5'
                    },
                    {
                        'id': 'T006.N006',
                        'text': '6'
                    },
                    {
                        'id': 'T006.N007',
                        'text': '7'
                    },
                    {
                        'id': 'T006.N008',
                        'text': '8'
                    },
                    {
                        'id': 'T006.N009',
                        'text': '9'
                    },
                    {
                        'id': 'T006.N00A',
                        'text': '10'
                    },
                    {
                        'id': 'T006.N00B',
                        'text': '11'
                    },
                    {
                        'id': 'T006.N00C',
                        'text': '12'
                    },
                    {
                        'id': 'T006.N012',
                        'text': '1-2'
                    },
                    {
                        'id': 'T006.N023',
                        'text': '2-3'
                    },
                    {
                        'id': 'T006.N034',
                        'text': '3-4'
                    },
                    {
                        'id': 'T006.N045',
                        'text': '4-5'
                    },
                    {
                        'id': 'T006.N046',
                        'text': '4-6'
                    },
                    {
                        'id': 'T006.N056',
                        'text': '5-6'
                    },
                    {
                        'id': 'T006.N035',
                        'text': '3-5'
                    },
                    {
                        'id': 'T006.N036',
                        'text': '3-6'
                    },
                    {
                        'id': 'T006.N100',
                        'text': 'Half'
                    },
                        ]
                    },
                    {
                        'id': 'T006.TM',
                        'text': '',
                        'children': [
                    {
                        'id': 'T006.TM01',
                        'text': 'Year'
                    },
                    {
                        'id': 'T006.TM02',
                        'text': 'Month'
                    },
                    {
                        'id': 'T006.TM03',
                        'text': 'Week'
                    },
                    {
                        'id': 'T006.TM04',
                        'text': 'Day'
                    },
                    {
                        'id': 'T006.TM11',
                        'text': 'Age'
                    },
                        ]
                    },
                    ]
                },
                {
                    'id': 'T007',
                    'text': 'Genetic Identification',
                    'children': [
                        {
                            'id': 'T007.B001',
                            'text': 'Saliva'
                        },
                        {
                            'id': 'T007.B002',
                            'text': 'Oral Wiper'
                        },
                        {
                            'id': 'T007.B003',
                            'text': 'Blood'
                        },
                    ]
                },
                {
                    'id': 'T008',
                    'text': 'Metabolomics Test',
                },
                {
                    'id': 'T009',
                    'text': 'Consultation',
                    'children': [
                        {
                            'id': 'T009.B001',
                            'text': 'Consultation(Internal)'
                        },
                        {
                            'id': 'T009.B002',
                            'text': 'Consultation(External)'
                        },
                    ]
                },
                {
                    'id': 'T010',
                    'text': 'Imaging',
                    'children': [
                        {
                            'id': 'T010.IM01',
                            'text': 'CT'
                        },
                        {
                            'id': 'T010.IM02',
                            'text': 'MRI'
                        },
                        {
                            'id': 'T010.IM03',
                            'text': 'Corneal Topography'
                        },
                        {
                            'id': 'T010.IM04',
                            'text': 'Fundus Photography'
                        },
                        {
                            'id': 'T010.IM05',
                            'text': 'OCT'
                        },
                        {
                            'id': 'T010.IM06',
                            'text': 'IOL Master'
                        },
                        {
                            'id': 'T010.IM07',
                            'text': 'Eye Appearance Photo'
                        },
                        {
                            'id': 'T010.IM08',
                            'text': 'VEP'
                        },
                        {
                            'id': 'T010.IM09',
                            'text': 'Ultrasound'
                        },
                        {
                            'id': 'T010.IM10',
                            'text': 'ERG'
                        },
                        {
                            'id': 'T010.IM11',
                            'text': 'RetCam'
                        },
                        {
                            'id': 'T010.IM12',
                            'text': 'SLO'
                        },
                        {
                            'id': 'T010.IM30',
                            'text': 'General Anesthesia'
                        },
                    ]
                },
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}


/**
* Get a human-readable treatment text from tree view.
*
* @param {jquery_selector} jquery selector for target div.
*/
function getHumanReadableRopTreatmentFromTreeView(jquery_selector) {
    // $().jstree(true) means to get an existing instance (will not create new instance)
    var ids = $(jquery_selector).jstree(true).get_selected();

    // ids.remove(["T009", "T010"], true);

    if (ids.some(function (item) {
        return item.contains("T004.");
    })) {
        ids.remove(["T004"], true);
    }

    if (ids.some(function (item) {
        return item.contains("T007.");
    })) {
        ids.remove(["T007"], true);
    }

    if (ids.some(function (item) {
        return item.contains("T009.");
    })) {
        ids.remove(["T009"], true);
    }

    if (ids.some(function (item) {
            return item.contains("T010.");
    })) {
        ids.remove(["T010"], true);
    }

    var text = "";

    var nodes = $(jquery_selector).jstree(true).get_checked(true);

    function compare(a, b) {
        var aid = a.id;
        var bid = b.id;

        if (aid < bid)
            return -1;
        if (aid > bid)
            return 1;
        return 0;
    }
    nodes.sort(compare);

    var encounter = false;
    $.each(nodes, function (i, n) {
        if (ids.contains(n.id)) {
            if (n.id.startWith("T001") || n.id.startWith("T006")) {
                if (encounter == true) {
                    text += n.text;
                }
                else {
                    text += "," + n.text;
                }
                encounter = true;
            }
            else {
                text += "," + n.text;
                encounter = false;
            }
        }
    });

    if (text.startWith(",")) {
        text = text.slice(1);
    }

    return text;
}

function createTreeviewForRopDiagnosisEn(jquery_selector, checked_nodes, open_all) {
    var data = [
        {
            'id': 'D000',
            'text': 'Retina with Completed Vascularization'
        },
        {
            'id': 'D001',
            'text': 'Immature Retina',
            'children': [
                        {
                            'id': 'D001.Z',
                            'text': 'Zones',
                            'children': [
                                {
                                    'id': 'D001.Z001',
                                    'text': 'Zone I'
                                },
                                {
                                    'id': 'D001.Z002',
                                    'text': 'Zone II'
                                },
                                {
                                    'id': 'D001.Z003',
                                    'text': 'Zone III'
                                },
                            ]
                        },                        
                        {
                            'id': 'D001.P',
                            'text': 'Plus',
                            'children': [
                                {
                                    'id': 'D001.P001',
                                    'text': '+'
                                },
                                {
                                    'id': 'D001.P002',
                                    'text': '++'
                                },
                                {
                                    'id': 'D001.P003',
                                    'text': '+++'
                                },
                            ]
                        },
                ]
        },
        {
            'id': 'D002',
            'text': 'ROP',
            'children': [                
                {
                    'id': 'D002.A001',
                    'text': 'Acute ROP',
                    'children': [
                        {
                            'id': 'D002.A001.Z',
                            'text': 'Zones',
                            'children': [
                                {
                                    'id': 'D002.A001.Z001',
                                    'text': 'Zone I'
                                },
                                {
                                    'id': 'D002.A001.Z002',
                                    'text': 'Zone II'
                                },
                                {
                                    'id': 'D002.A001.Z003',
                                    'text': 'Zone III'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.S',
                            'text': 'Stages',
                            'children': [
                                {
                                    'id': 'D002.A001.S001',
                                    'text': 'Stage 1'
                                },
                                {
                                    'id': 'D002.A001.S002',
                                    'text': 'Stage 2'
                                },
                                {
                                    'id': 'D002.A001.S003',
                                    'text': 'Stage 3'
                                },
                                {
                                    'id': 'D002.A001.S004',
                                    'text': 'Stage 4',
                                    'children': [
                                        {
                                            'id': 'D002.A001.S004.A',
                                            'text': '4A',
                                        },
                                        {
                                            'id': 'D002.A001.S004.B',
                                            'text': '4B',
                                        },
                                    ]
                                },
                                {
                                    'id': 'D002.A001.S005',
                                    'text': 'Stage 5'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.PI',
                            'text': 'Plus(ICROP)',
                            'children': [
                                {
                                    'id': 'D002.A001.PI001',
                                    'text': 'pre-plus'
                                },
                                {
                                    'id': 'D002.A001.PI002',
                                    'text': 'plus'
                                }
                            ]
                        },
                        {
                            'id': 'D002.A001.P',
                            'text': 'Plus',
                            'children': [
                                {
                                    'id': 'D002.A001.P001',
                                    'text': '+'
                                },
                                {
                                    'id': 'D002.A001.P002',
                                    'text': '++'
                                },
                                {
                                    'id': 'D002.A001.P003',
                                    'text': '+++'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.1',
                            'text': 'Type 1 ROP',
                        },
                        {
                            'id': 'D002.A001.2',
                            'text': 'Type 2 ROP',
                        },
                        {
                            'id': 'D002.A001.3',
                            'text': 'Threshold ROP',
                        },
                        {
                            'id': 'D002.A001.4',
                            'text': 'APROP',
                        },
                    ]
                },                
                {
                    'id': 'D002.A002',
                    'text': 'Regression of ROP',
                    'children': [
                        {
                            'id': 'D002.A002.Z003',
                            'text': 'Peripheral retina'
                        },
                        {
                            'id': 'D002.A002.Z001',
                            'text': 'Posterior retina'
                        }]
                },
            ]
        },        
        {
            'id': 'D003',
            'text': 'Reactivation of Anti-VEGF Agent'
        },
        {
            'id': 'D004',
            'text': 'Complications of ROP Surgey'
        },
        {
            'id': 'D005',
            'text': 'Post-operative Condition',
            'children': [
                {
                    'id': 'D004.G001',
                    'text': 'Intravitreal Injection',
                    'children': [
                        {
                            'id': 'D004.G001.M001',
                            'text': 'Ranibizumab'
                        },
                        {
                            'id': 'D004.G001.M002',
                            'text': 'Bevacizumab'
                        },
                        {
                            'id': 'D004.G001.M003',
                            'text': 'Conbercept'
                        }]
                },
                {
                    'id': 'D004.G002',
                    'text': 'Laser Photocoagulation'
                },
                {
                    'id': 'D004.G003',
                    'text': 'Vitreoretinal Surgery'
                },
            ]
        },
        {
            'id': 'D010',
            'text': 'Other Diagnosis Except ROP',
            'children': [
                {
                    'id': 'D010.D101',
                    'text': 'FEVR'
                },
                {
                    'id': 'D010.D102',
                    'text': 'PHPV'
                },
                {
                    'id': 'D010.D103',
                    'text': 'Coloboma of Choroid'
                },
                {
                    'id': 'D010.D104',
                    'text': 'Retinoblastoma'
                },
                {
                    'id': 'D010.D105',
                    'text': 'Morning Glory Syndrome'
                },
                {
                    'id': 'D010.D106',
                    'text': 'Norries Disease'
                },
                {
                    'id': 'D010.D107',
                    'text': 'Coats Disease'
                },
                {
                    'id': 'D010.D117',
                    'text': 'congenital retinoschisis'
                },
                {
                    'id': 'D010.D122',
                    'text': 'congenital hypertrophy of retinal pigment epithelium'
                },
                {
                    'id': 'D010.D118',
                    'text': 'myelinated nerve fiber'
                },
                {
                    'id': 'D010.D119',
                    'text': 'fundus of dbinoism'
                },
                {
                    'id': 'D010.D120',
                    'text': 'tessellated retina'
                },
                {
                    'id': 'D010.D121',
                    'text': 'RP'
                },
                {
                    'id': 'D010.D123',
                    'text': 'Yolk-like macular dystrophy'
                },
                {
                    'id': 'D010.D124',
                    'text': 'Congenital cataract'
                },
                {
                    'id': 'D010.D125',
                    'text': 'Pupillary remnant'
                },
                {
                    'id': 'D010.D110',
                    'text': 'Others'
                }
            ]
        },
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}

function createTreeviewForRopLabel(jquery_selector, checked_nodes) {
    var data = [
        {
            'id': 'C.0', // n/a
            'text': '不是有效的眼底照片'
        },
        {
            'id': 'C.1', // low quality
            'text': '图片质量太差，无法用于诊断'
        },
        {
            'id': 'C.2', // negative
            'text': '正常（无ROP及其它眼底病）'
        },
        {
            'id': 'C.3', // postive
            'text': '异常（有ROP或其它眼底病）'
        },
        {
            'id': 'C.10', // favorite
            'text': '收藏（用于教学及培训系统）'
        },
        {
            'id': 'L',
            'text': '眼别',
            'children': [
                {
                    'id': 'L001',
                    'text': 'OD'
                },
                {
                    'id': 'L002',
                    'text': 'OS'
                },
            ]
        },
        //{
        //    'id': 'Q',
        //    'text': '质量分级',
        //    'children': [
        //        {
        //            'id': 'Q1',
        //            'text': 'HQ'
        //        },
        //        {
        //            'id': 'Q0',
        //            'text': 'LQ'
        //        },
        //    ]
        //},
        {
            'id': 'D001',
            'text': '视网膜发育不全',
            'children': [
                {
                    'id': 'D001.P001',
                    'text': '视网膜发育不全+'
                },
                {
                    'id': 'D001.P002',
                    'text': '视网膜发育不全++'
                },
                {
                    'id': 'D001.P003',
                    'text': '视网膜发育不全+++'
                },
            ]
        },
        {
            'id': 'D002',
            'text': '早产儿视网膜病变',
            'children': [
                {
                    'id': 'D002.A010',
                    'text': 'APROP',
                },
                {
                    'id': 'D002.A001',
                    'text': '急性期ROP',
                    'children': [
                        {
                            'id': 'D002.A001.Z',
                            'text': '分区',
                            'children': [
                                {
                                    'id': 'D002.A001.Z001',
                                    'text': '1区'
                                },
                                {
                                    'id': 'D002.A001.Z002',
                                    'text': '2区'
                                },
                                {
                                    'id': 'D002.A001.Z003',
                                    'text': '3区'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.S',
                            'text': '分期',
                            'children': [
                                {
                                    'id': 'D002.A001.S001',
                                    'text': '1期'
                                },
                                {
                                    'id': 'D002.A001.S002',
                                    'text': '2期'
                                },
                                {
                                    'id': 'D002.A001.S003',
                                    'text': '3期'
                                },
                                {
                                    'id': 'D002.A001.S004',
                                    'text': '4期',
                                    'children': [
                                        {
                                            'id': 'D002.A001.S004.A',
                                            'text': '4A',
                                        },
                                        {
                                            'id': 'D002.A001.S004.B',
                                            'text': '4B',
                                        },
                                    ]
                                },   
                                {
                                    'id': 'D002.A001.S005',
                                    'text': '5期'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.PI',
                            'text': 'Plus(ICROP)',
                            'children': [
                                {
                                    'id': 'D002.A001.PI001',
                                    'text': 'pre-plus'
                                },
                                {
                                    'id': 'D002.A001.PI002',
                                    'text': 'plus'
                                }
                            ]
                        },
                        {
                            'id': 'D002.A001.P',
                            'text': 'Plus病变',
                            'children': [
                                {
                                    'id': 'D002.A001.P001',
                                    'text': '+'
                                },
                                {
                                    'id': 'D002.A001.P002',
                                    'text': '++'
                                },
                                {
                                    'id': 'D002.A001.P003',
                                    'text': '+++'
                                },
                            ]
                        },
                    ]
                },
                {
                    'id': 'D002.A020',
                    'text': '阈值ROP',
                },
                {
                    'id': 'D002.A031',
                    'text': '阈值前期1型ROP',
                },
                {
                    'id': 'D002.A032',
                    'text': '阈值前期2型ROP',
                }
            ]
        },
        {
            'id': 'D003',
            'text': '退行性ROP',
            'children': [
                {
                    'id': 'D003.Z001',
                    'text': '周边'
                },
                {
                    'id': 'D003.Z002',
                    'text': '后极'
                }]
        },
        {
            'id': 'D004',
            'text': 'ROP术后',
            'children': [
                {
                    'id': 'D004.G001',
                    'text': '注药术后',
                    'children': [
                        {
                            'id': 'D004.G001.M001',
                            'text': '雷珠单抗'
                        },
                        {
                            'id': 'D004.G001.M002',
                            'text': '贝伐单抗'
                        },
                        {
                            'id': 'D004.G001.M003',
                            'text': '融合蛋白'
                        }]
                },
                {
                    'id': 'D004.G002',
                    'text': '激光术后'
                },
                {
                    'id': 'D004.G003',
                    'text': '玻璃体视网膜手术后'
                },
                {
                    'id': 'D004.G004',
                    'text': '晶状体切除术后'
                },
                {
                    'id': 'D004.G010',
                    'text': '其他'
                }
            ]
        },
        {
            'id': 'D010',
            'text': '其它诊断',
            'children': [
                {
                    'id': 'D010.D101',
                    'text': 'FEVR'
                },
                {
                    'id': 'D010.D102',
                    'text': 'PHPV'
                },
                {
                    'id': 'D010.D103',
                    'text': '脉络膜缺损'
                },
                {
                    'id': 'D010.D104',
                    'text': '视网膜母细胞瘤'
                },
                {
                    'id': 'D010.D105',
                    'text': '牵牛花综合征'
                },
                {
                    'id': 'D010.D106',
                    'text': 'Norries病'
                },
                {
                    'id': 'D010.D107',
                    'text': 'Coats病'
                },
                {
                    'id': 'D010.D117',
                    'text': '先天性视网膜劈裂症'
                },
                {
                    'id': 'D010.D122',
                    'text': '先天性视网膜色素上皮肥大'
                },
                {
                    'id': 'D010.D118',
                    'text': '视网膜有髓神经纤维'
                },
                {
                    'id': 'D010.D119',
                    'text': '白化病眼底'
                },
                {
                    'id': 'D010.D120',
                    'text': '豹纹状眼底'
                },
                {
                    'id': 'D010.D121',
                    'text': '视网膜色素变性'
                },
                {
                    'id': 'D010.D123',
                    'text': '卵黄样黄斑营养不良'
                },
                {
                    'id': 'D010.D124',
                    'text': '先天性白内障'
                },
                {
                    'id': 'D010.D125',
                    'text': '瞳孔残膜'
                },
                {
                    'id': 'D010.D110',
                    'text': '其它'
                }
            ]
        },
    ];
    createTreeview(jquery_selector, data, checked_nodes, false, 'L,D002,D002.A001,D002.A001.S');
}

function createTreeviewForRopLabelEn(jquery_selector, checked_nodes) {
    var data = [
        {
            'id': 'C.0', // n/a
            'text': 'Not a valid fundus photo'
        },
        {
            'id': 'C.1', // low quality
            'text': 'Low quality (blurred, vague)'
        },
        {
            'id': 'C.2', // negative
            'text': 'No disease'
        },
        {
            'id': 'C.3', // postive
            'text': 'Disease (ROP or other fundus disease)'
        },
        {
            'id': 'C.10', // favorite
            'text': 'Favorite'
        },
        {
            'id': 'L',
            'text': 'Laterality',
            'children': [
                {
                    'id': 'L001',
                    'text': 'OD'
                },
                {
                    'id': 'L002',
                    'text': 'OS'
                },
            ]
        },
        {
            'id': 'D001',
            'text': 'Immature Retina',
            'children': [
                {
                    'id': 'D001.P001',
                    'text': 'Immature Retina+'
                },
                {
                    'id': 'D001.P002',
                    'text': 'Immature Retina++'
                },
                {
                    'id': 'D001.P003',
                    'text': 'Immature Retina+++'
                },
            ]
        },
        {
            'id': 'D002',
            'text': 'ROP',
            'children': [
                {
                    'id': 'D002.A010',
                    'text': 'ARROP',
                },
                {
                    'id': 'D002.A001',
                    'text': 'Acute ROP',
                    'children': [
                        {
                            'id': 'D002.A001.Z',
                            'text': 'Zones',
                            'children': [
                                {
                                    'id': 'D002.A001.Z001',
                                    'text': 'Zone I'
                                },
                                {
                                    'id': 'D002.A001.Z002',
                                    'text': 'Zone II'
                                },
                                {
                                    'id': 'D002.A001.Z003',
                                    'text': 'Zone III'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.S',
                            'text': 'Stages',
                            'children': [
                                {
                                    'id': 'D002.A001.S001',
                                    'text': 'Stage 1'
                                },
                                {
                                    'id': 'D002.A001.S002',
                                    'text': 'Stage 2'
                                },
                                {
                                    'id': 'D002.A001.S003',
                                    'text': 'Stage 3'
                                },
                                {
                                    'id': 'D002.A001.S004',
                                    'text': 'Stage 4',
                                    'children': [
                                        {
                                            'id': 'D002.A001.S004.A',
                                            'text': '4A',
                                        },
                                        {
                                            'id': 'D002.A001.S004.B',
                                            'text': '4B',
                                        },
                                    ]
                                },
                                {
                                    'id': 'D002.A001.S005',
                                    'text': 'Stage 5'
                                },
                            ]
                        },
                        {
                            'id': 'D002.A001.PI',
                            'text': 'Plus(ICROP)',
                            'children': [
                                {
                                    'id': 'D002.A001.PI001',
                                    'text': 'pre-plus'
                                },
                                {
                                    'id': 'D002.A001.PI002',
                                    'text': 'plus'
                                }
                            ]
                        },
                        {
                            'id': 'D002.A001.P',
                            'text': 'Plus',
                            'children': [
                                {
                                    'id': 'D002.A001.P001',
                                    'text': '+'
                                },
                                {
                                    'id': 'D002.A001.P002',
                                    'text': '++'
                                },
                                {
                                    'id': 'D002.A001.P003',
                                    'text': '+++'
                                },
                            ]
                        },
                    ]
                },
                {
                    'id': 'D002.A020',
                    'text': 'Threshold ROP',
                },
                {
                    'id': 'D002.A031',
                    'text': 'Type 1 Pre-threshold ROP',
                },
                {
                    'id': 'D002.A032',
                    'text': 'Type 2 Pre-threshold ROP',
                }
            ]
        },
        {
            'id': 'D003',
            'text': 'Degenerative ROP',
            'children': [
                {
                    'id': 'D003.Z001',
                    'text': 'Peripheral retina'
                },
                {
                    'id': 'D003.Z002',
                    'text': 'Posterior retina'
                }]
        },
        {
            'id': 'D004',
            'text': 'ROP Surgery History',
            'children': [
                {
                    'id': 'D004.G001',
                    'text': 'Intravitreal Injection',
                    'children': [
                        {
                            'id': 'D004.G001.M001',
                            'text': 'Ranibizumab'
                        },
                        {
                            'id': 'D004.G001.M002',
                            'text': 'Bevacizumab'
                        },
                        {
                            'id': 'D004.G001.M003',
                            'text': 'Fusion Protein'
                        }]
                },
                {
                    'id': 'D004.G002',
                    'text': 'Laser Photocoagulation'
                },
                {
                    'id': 'D004.G003',
                    'text': 'Vitreoretinal Surgery'
                },
                {
                    'id': 'D004.G010',
                    'text': 'Others'
                }
            ]
        },
        {
            'id': 'D010',
            'text': 'Other Diagnosis',
            'children': [
                {
                    'id': 'D004.G004',
                    'text': 'Lensectomy'
                },
                {
                    'id': 'D010.D101',
                    'text': 'FEVR'
                },
                {
                    'id': 'D010.D102',
                    'text': 'PHPV'
                },
                {
                    'id': 'D010.D103',
                    'text': 'Coloboma of Choroid'
                },
                {
                    'id': 'D010.D104',
                    'text': 'Retinoblastoma'
                },
                {
                    'id': 'D010.D105',
                    'text': 'Morning Glory Syndrome'
                },
                {
                    'id': 'D010.D106',
                    'text': 'Norries Disease'
                },
                {
                    'id': 'D010.D107',
                    'text': 'Coats Disease'
                },
                {
                    'id': 'D010.D117',
                    'text': 'congenital retinoschisis'
                },
                {
                    'id': 'D010.D122',
                    'text': 'congenital hypertrophy of retinal pigment epithelium'
                },
                {
                    'id': 'D010.D118',
                    'text': 'myelinated nerve fiber'
                },
                {
                    'id': 'D010.D119',
                    'text': 'fundus of dbinoism'
                },
                {
                    'id': 'D010.D120',
                    'text': 'tessellated retina'
                },
                {
                    'id': 'D010.D121',
                    'text': 'RP'
                },
                {
                    'id': 'D010.D123',
                    'text': 'Yolk-like macular dystrophy'
                },
                {
                    'id': 'D010.D124',
                    'text': 'Congenital cataract'
                },
                {
                    'id': 'D010.D125',
                    'text': 'Pupillary remnant'
                },
                {
                    'id': 'D010.D110',
                    'text': 'Others'
                }
            ]
        },
    ];
    createTreeview(jquery_selector, data, checked_nodes, false, 'L,D002');
}


function createTreeviewForFoodEn(jquery_selector, checked_nodes) {
    var data = [
        {
            'id': 'CHEBI_24431',
            'text': 'chemical entity (CHEBI_24431) [+]'
        },
        {
            'id': 'ENVO_00010483',
            'text': 'environmental material (ENVO_00010483)',
            'children': [
                {
                    'id': 'ENVO_00003031',
                    'text': 'animal manure (ENVO_00003031) [+]'
                },
                {
                    'id': 'ENVO_0010001',
                    'text': 'anthropogenic (ENVO_0010001) [+]'
                },
                {
                    'id': 'FOODON_00002403',
                    'text': 'food material (FOODON_00002403)',
                    'children': [
                        {
                            'id': 'FOODON_03411215',
                            'text': 'algae, bacteria or fungus (FOODON_03411215) [+]'
                        },
                        {
                            'id': 'FOODON_03411222',
                            'text': 'fish (FOODON_03411222) [+]'
                        },
                        {
                            'id': 'FOODON_00001176',
                            'text': 'invertebrate food source (FOODON_00001176)',
                            'children': [
                                {
                                    'id': 'FOODON_03411142',
                                    'text': 'aquatic invertebrate animal (FOODON_03411142) [+]'
                                },
                                {
                                    'id': 'FOODON_03411220',
                                    'text': 'insect (FOODON_03411220) [+]'
                                }
                            ]
                        },
                        {
                            'id': 'FOODON_00001015',
                            'text': 'plant (FOODON_00001015)',
                            'children': [
                                {
                                    'id': 'PO_0009005',
                                    'text': 'root (PO_0009005) [+]'
                                },
                                {
                                    'id': 'PO_0009001',
                                    'text': 'fruit (PO_0009001) [+]'
                                },
                                {
                                    'id': 'FOODON_00001173',
                                    'text': 'Seed (FOODON_00001173)',
                                    'children': [
                                        {
                                            'id': 'FOODON_03310306',
                                            'text': 'sesame (FOODON_03310306)'
                                        },
                                        {
                                            'id': 'FOODON_03412524',
                                            'text': 'euryale (FOODON_03412524)'
                                        },
                                        {
                                            'id': 'FOODON_00002099',
                                            'text': 'peanut (FOODON_00002099) [+]'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        },
    ];
    createTreeview(jquery_selector, data, checked_nodes, true);
}

/**
* Create a jstree view control for table of book contents.
*
* @param {jquery_selector} jquery selector for target div.
*/
function createTreeviewForBookContentsPart1(jquery_selector, checked_nodes, open_all) {
    var data = [        
        {
            "id": "C002",
            "text": "数据获取和传输 - 图谱检测数据的高效获取和传输",
            "children": [
                {
                    "id": "C001",
                    "text": "数据源 - 常见的图谱快检设备及原理",
                    "children": [
                        {
                            "id": "C001.1",
                            "text": "拉曼"
                        },
                        {
                            "id": "C001.2",
                            "text": "MALDI-TOF MS"
                        },
                        {
                            "id": "C001.3",
                            "text": "IMS"
                        },
                        {
                            "id": "C001.4",
                            "text": "UV"
                        }
                    ]
                },
                {
                    "id": "C002.1",
                    "text": "信号压缩"
                },
                {
                    "id": "C002.2",
                    "text": "信号稀疏性分析"
                },
                {
                    "id": "C002.3",
                    "text": "压缩感知"
                },
                {
                    "id": "C002.4",
                    "text": "信号加密传输"
                }
            ]
        },
        {
            "id": "C003",
            "text": "数据预处理 - 图谱检测数据的预处理",
            "children": [
                {
                    "id": "C003.1",
                    "text": "基线检测与基线漂移消除"
                },
                {
                    "id": "C003.2",
                    "text": "噪声消除"
                }
            ]
        },
        {
            "id": "C004",
            "text": "特征提取 - 图谱检测数据的特征提取",
            "children": [
                {
                    "id": "C004.1",
                    "text": "LASSO、ElasticNet"
                },
                {
                    "id": "C004.2",
                    "text": "Group LASSO"
                },
                {
                    "id": "C004.3",
                    "text": "Auto Encoder"
                },
                {
                    "id": "C004.4",
                    "text": "流形学习 Manifold Learning"
                },
                {
                    "id": "C004.5",
                    "text": "随机投影 RP"
                }
            ]
        },
        {
            "id": "C005",
            "text": "数据融合 - 多谱融合分析",
            "children": [
                {
                    "id": "C005.1",
                    "text": "概论及常见数据融合方法介绍"
                },
                {
                    "id": "C005.3",
                    "text": "集成学习 Ensemble Learning"
                },
                {
                    "id": "C005.2",
                    "text": "数据融合案例：Raman+UV"
                }
            ]
        },
        {
            "id": "C006",
            "text": "分类预测 - 分类器模型",
            "children": [
                {
                    "id": "C006.1",
                    "text": "NNRW 随机权神经网络"
                },
                {
                    "id": "C006.2",
                    "text": "多核学习 MKL"
                }
            ]
        },
        {
            "id": "C007",
            "text": "原型系统",
            "children":      [
            {
                "id": "C007.1",
                "text": "指纹图谱库"
            },
            {
                "id": "C007.2",
                "text": "算法库"
            },
            {
                "id": "C007.3",
                "text": "算法流水线模型"
            }
        ],
        },   
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}

function createTreeviewForBookContentsPart2(jquery_selector, checked_nodes, open_all) {
    var data = [
        {
            "id": "C002",
            "text": "非结构化数据 - 图像数据",
            "children": [
                {
                    "id": "C001",
                    "text": "数据源",
                    "children": [
                        {
                            "id": "C001.1",
                            "text": "光学"
                        },
                        {
                            "id": "C001.2",
                            "text": "X射线"
                        },
                        {
                            "id": "C001.3",
                            "text": "荧光"
                        }
                    ]
                }
            ]
        },
        {
            "id": "C003",
            "text": "数据预处理",
            "children": [
                {
                    "id": "C003.1",
                    "text": "图像增强"
                },
                {
                    "id": "C003.2",
                    "text": "噪声消除"
                }
            ]
        },
        {
            "id": "C004",
            "text": "特征提取",
            "children": [
                {
                    "id": "C004.1",
                    "text": "人工特征工程 - 纹理、边缘等低级形态学提取算子"
                },
                {
                    "id": "C004.2",
                    "text": "基于深度学习的自动特征提取 - 卷积层"
                }           
            ]
        },        
        {
            "id": "C006",
            "text": "图像分类",
            "children": [
                {
                    "id": "C006.1",
                    "text": "AlexNet"
                },
                {
                    "id": "C006.2",
                    "text": "GoogLeNet"
                },
                {
                    "id": "C006.3",
                    "text": "VGG"
                },
                {
                    "id": "C006.4",
                    "text": "实例 - 迁移学习"
                }
            ]
        },
        {
            "id": "C007",
            "text": "目标检测",
            "children": [
                {
                    "id": "C007.1",
                    "text": "RCNN系列"
                },
                {
                    "id": "C007.2",
                    "text": "Yolo系列"
                }
            ],
        },
        {
            "id": "C008",
            "text": "图像分割",
            "children": [
                {
                    "id": "C008.2",
                    "text": "U-Net"
                },
                {
                    "id": "C008.1",
                    "text": "Mask-RCNN"
                }
            ],
        },
        {
            "id": "C010",
            "text": "深度学习可解释性 Explainable AI",
            "children": [
                {
                    "id": "C010.1",
                    "text": "CAM, grad-CAM"
                },
                {
                    "id": "C010.2",
                    "text": "LRP"
                }
            ]
        }, 
        {
            "id": "C009",
            "text": "案例分析",
            "children": [
                {
                    "id": "C009.1",
                    "text": "案例1："
                },
                {
                    "id": "C009.2",
                    "text": "案例2："
                }
            ],
        },
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}

function createTreeviewForBookContentsPart3(jquery_selector, checked_nodes, open_all) {
    var data = [
        {
            "id": "C002",
            "text": "非结构化数据 - 文本数据",
            "children": [
                {
                    "id": "C001",
                    "text": "数据源",
                    "children": [
                        {
                            "id": "C001.1",
                            "text": "网络评论"
                        },
                        {
                            "id": "C001.2",
                            "text": "Web Crawler 爬虫"
                        }
                    ]
                }
            ]
        },        
        {
            "id": "C004",
            "text": "特征提取",
            "children": [
                {
                    "id": "C004.1",
                    "text": "词向量"
                }
            ]
        },
        {
            "id": "C003",
            "text": "主题模型",
            "children": [
                {
                    "id": "C003.1",
                    "text": "tf-idf"
                },
                {
                    "id": "C003.2",
                    "text": "RNN"
                }
            ]
        },
        {
            "id": "C005",
            "text": "命名实体识别（Named EntitiesRecognition，NER）",
            "children": [
                {
                    "id": "C005.1",
                    "text": "时间提取"
                },
                {
                    "id": "C005.3",
                    "text": "地点提取"
                },
                {
                    "id": "C005.2",
                    "text": "事件提取"
                }
            ]
        },
        {
            "id": "C006",
            "text": "情感分析",
            "children": [
                {
                    "id": "C006.1",
                    "text": "RNN"
                },
                {
                    "id": "C006.2",
                    "text": "CNN"
                },
                {
                    "id": "C006.3",
                    "text": "LSTM"
                }
            ]
        },
        {
            "id": "C007",
            "text": "案例分析",
            "children": [
                {
                    "id": "C007.1",
                    "text": "案例1："
                },
                {
                    "id": "C007.2",
                    "text": "案例2："
                }
            ],
        },
    ];
    createTreeview(jquery_selector, data, checked_nodes, open_all);
}