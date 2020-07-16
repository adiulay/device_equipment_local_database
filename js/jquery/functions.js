$(document).ready(function() {
    // CALL FUNCTIONS
    function popup_result(message, id_tag) {
        $(`#${id_tag}`).replaceWith(`<p id="${id_tag}"><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>${message}</p>`)

        $(`#${id_tag}`).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Close": function() {
                    location.reload();
                    // window.location.replace("/addDevice");
                    $(this).dialog('close')
                }
            }
        })
    }

    // function ajax_post(device, params, date, description, result_msg) {
    function ajax_post(device, id, device_data, result_msg, id_tag) {
        if (typeof device_data != 'object') {
            popup_result('Error: device_data not object, functions.js line 86');
        } else {
        // console.log(typeof device_data)
            $.ajax({
                // url: `/${device}/${params}/?date=${date}&desc=${description}`,
                url: `/${device}/${id}?dataDevice=${JSON.stringify(device_data)}`, //stringify converts json(object) to string
                method: 'post',
                success: function(result) {
                    popup_result(result_msg, id_tag);
                    console.log(result);
                },
                error: function(err) {
                    if (err.status == 500) {
                        popup_result(`Unique ID ${id} has already been added.`, 'add-result')
                    } else if (err.status == 501) {
                        popup_result(`${id} is not found in database`, 'add-result')
                    } else {
                        popup_result('sorry, something went wrong. try again later.', 'add-result');
                        console.log(err);
                    }
                }
            })
        }
    }

    $("#test").hide(300).show(300);

    $('.accordion').accordion({
        collapsible: true,
        active: false
    });

    // timer, option argument for either add or edit device
    function timeWatcher(windowOpen) {
        // this one is nasty, sets interval checking if that window is closed... yet
        timer = setInterval(function() {
            // made me looked into the devloper tool...
            // if the add.closed is false will repeat 
            if (windowOpen.closed == true) {
                // reloads current page (main parent localhost:3000)
                document.location.reload()

                // ends the timer when true
                clearInterval(timer);
            }
        }, 1000)
    }

    $('#add').on('click', function() {
        var add = window.open('/addDevice', 'Add Device', "width=600, height=700");
        console.log(add)
        timeWatcher(add);
    })

    $('#edit').on('click', function() {
        var edit = window.open('/editDevice', 'Edit Device', "width=600, height=700");
        console.log(edit)
        timeWatcher(edit)
    })

    $('#searchInput').on('keyup', function() {
        // location: <input type="text" id="searchInput" placeholder="Search...">
        var valueInput = $(this).val().toLowerCase();

        // the holy search function (using filters)
        $("#deviceTable tr").filter(function() {
            // $(this).text().toLowerCase() <-- this grabs all the text from the page... per row
            
            // hides row that does not match search input
            $(this).toggle($(this).text().toLowerCase().indexOf(valueInput) > -1)
        });
        
    });

    $('#close').on('click', function() {
        window.close()
    })

    $('#toggleSelect').hide()
    $('.toggleCheckbox').hide()
    $('#toggleEdit').on('click', function() {
        $('#toggleSelect').toggle()
        $('.toggleCheckbox').toggle()
    })

    // for index.html, checkmarks as object hold id devices
    var list_id = {
        0: []
    };

    // checkbox, when check add to list_id, when unchecked, remove from list_id
    $('input[type="checkbox"]').on('click', function() {
        var id = $(this).attr("data-info");
        // console.log('This is an id: ' + id);

        // the prop check thing checks to see if the checkmark is checked
        if ($(this).prop("checked") == true) {
            // if true, will push to a temperary array object
            list_id[0].push(id);

            // console.log(list_id)
        } else if ($(this).prop("checked") == false) {
            // if false, will remove the selected
            for (i = 0; i < list_id[0].length; i++) {
                if (list_id[0][i] == id) {
                    list_id[0].splice(i, 1);
                }
            }
            // console.log(list_id)
        }

    })

    // this has two options, select None or All
    $('#selectOption').change(function() {
        // select tag from index.html, grabs the text of the value
        var select_value = $(this).find('option:selected').text();

        if (select_value == "None") {
            $('input[type="checkbox"]').prop('checked', false);

            // make a clean slate
            list_id = {
                0: []
            }

            console.log(list_id)

        } else if (select_value == "All") {
            $('input[type="checkbox"]').prop('checked', true);

            // this loops over every checkbox with the attr of data-info... wtf
            $('input[type="checkbox"]').each(function() {
                var id = $(this).attr('data-info');
                list_id[0].push(id)
            })

            console.log(list_id)
        }
    })

    $('#delete-device-confirm').hide();
    $('#delete-result').hide();

    // document .on reloads the content without refreshing it
    $(document).on('click', '.delete', function() {
        //grabs the element data-info using "this" is the button that is clicked
        // places id in single object
        var id = {
            0: [$(this).attr('data-info')]
        };

        // console.log(id)

        var temp_array_id;

        // this checks if the checkmarks were presented then we apply it to temp_array_id
        if (list_id[0].length == 0) {
            temp_array_id = id;
        } else {
            temp_array_id = list_id;
        }

        $('#delete-device-confirm').dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Yes": function() {
                    // AJAX RUN POST TO DELETE (this post takes in array(list))
                    $.ajax({
                        url: `/deleteDevice/?id=${JSON.stringify(temp_array_id)}`,
                        method: 'post',
                        success: function(result) {
                            // returns result from nodejs app.js
                            console.log(result);
                        },
                        error: function(err) {
                            console.log(err)
                        }
                    })
                    // closes the confirm dialog
                    $(this).dialog("close");
                    // opens new dialog
                    popup_result('Device deleted', 'delete-result');
                },
                Cancel: function() {
                    $(this).dialog("close")
                }
            }
        })
    })

    $("#add-device-confirm").hide();
    $("#missing-information").hide();
    $('#add-result').hide();
    $('#date').datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true
    });
    $('#zone').selectmenu();
    $('#onboarding').selectmenu();

    $(document).on('submit', '#formDevice', function(e) {
        // this prevents it from sending it, not sure why o.o
        e.preventDefault();
        
        var ID = $('#ID').val();
        var date = $('#date').val();
        var zone = $('#zone').val();
        var model = $('#model').val();
        var description = $('#description').val();
        var fname = $('#fname').val();
        var lname = $('#lname').val();
        var onboarding = $('#onboarding').val();

        var data_device = {
            "id": ID,
            "date": date,
            "zone": zone,
            "model": model,
            "description": description,
            "fname": fname,
            "lname": lname,
            "onboarding": onboarding
        }

        var objInfo = [ID, zone, model, fname, lname, onboarding];

        $("#add-device-confirm").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Yes": function() {
                    var counter = 0;
                    for (var e of objInfo) {
                        if (e === "") {
                            counter++;
                            // console.log(e);
                        }
                    }

                    if (counter > 0) {
                        $(this).dialog('close');
                        $('#missing-information').dialog({
                            resizable: false,
                            height: "auto",
                            width: 400,
                            modal: true,
                            buttons: {
                                "Close": function() {
                                    $(this).dialog("close");
                                }
                            }
                        })
                    }

                    if (counter == 0) {
                        $(this).dialog('close');
                        // START ADDING TO DATABASE USING AJAX
                        var form_type = $('h1#form_type').text(); //grabs the title header

                        if (form_type == "Add Device"){
                            //calls function and runs query and insert statement
                            // ajax_post('addDevice', params, date, description, 'Device successfully added!');
                            ajax_post('addDevice', ID, data_device, 'Device successfully added!', 'add-result');

                        } else if (form_type == "Edit Device") {
                            // same thing as previous
                            // ajax_post('editDevice', params, date, description, 'Device Info updated!');
                            ajax_post('editDevice', ID, data_device, 'Device Info updated!', 'add-result');

                        }
                    }
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
    })
});