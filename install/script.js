// ------------register-steps--------------
$(document).ready(function () {
    $('.nav-tabs > li a[title]').tooltip();
    $('.prev-step').hide()
    let prevStep = 1
    //Wizard
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var $target = $(e.target);
        if ($target.hasClass('disabled')) {
            return false;
        }

        // handle with prgressbar 
        var step = $(e.target).data('step');
        var percent = (parseInt(step) / 4) * 100;
        $('.progress-bar').css({ width: percent + '%' });
        $('.progress-bar').text('Step ' + step + ' of 4');
        prevStep = step
        if (step === 1) {
            $('.prev-step').hide()
        } else {
            $('.prev-step').show()
        }
    });

    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);
        const $stepId = $target.attr('data-step')
        $('#step' + $stepId).addClass(prevStep < parseInt($stepId) ? 'forward' : 'backword')
        $target.parent().addClass('active');
    });

    $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        var $target = $(e.target);
        const $stepId = $target.attr('data-step')
        $('#step' + $stepId).removeClass('forward backword')
        $target.parent().removeClass('active');
    });


    $(".next-step").click(async function (e) {
        if (parseInt($(this)[0].getAttribute('data-step')) === 2) {
            movetoNext()
        } else {
            await checkConfiguration(parseInt($(this)[0].getAttribute('data-step')))
        }
    });

    $(".prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li a.active');
        prevTab($active);
    });

    $('#smtp-test-btn').click(() => checkConfiguration(2))

    // populate timezone
    populateTimezones();
});

function nextTab(elem) {
    $(elem).parent().next().find('a[data-toggle="tab"]').click();
}

function prevTab(elem) {
    $(elem).parent().prev().find('a[data-toggle="tab"]').click();
}

function movetoNext() {
    var $active = $('.wizard .nav-tabs li a.active');
    $active.parent().next().children().removeClass('disabled');
    $active.parent().addClass('done');
    nextTab($active);
}

function populateTimezones() {
    const timezoneSelect = $('#timezoneSelect')
    const timezones = Intl.supportedValuesOf('timeZone');
    timezones.sort();
    $.each(timezones, function (index, timezone) {
        timezoneSelect.append($('<option>', {
            value: timezone,
            text: timezone
        }));
    });
}

async function checkConfiguration(step) {
    switch (step) {
        case 1:
            Swal.fire({
                title: '',
                text: 'Please wait while we test the database connection using the provided configuration.',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const dbHost = $('#DbHost').val()
                    const dbPort = $('#DbPort').val()
                    const dbName = $('#DbName').val()
                    const dbUsername = $('#DbUsername').val()
                    const dbPassword = $('#DbPassword').val()
                    $.ajax({
                        url: '/install/checkdb',
                        method: 'POST',
                        contentType: 'application/json', // Set the content type to JSON
                        data: JSON.stringify({
                            dbHost,
                            dbPort,
                            dbName,
                            dbUsername,
                            dbPassword
                        }),
                        success: function (result) {
                            Swal.hideLoading()
                            Swal.fire({
                                title: 'Connection Passed',
                                text: 'We are able to connect to database successfully.',
                                icon: 'success',
                                confirmButtonText: 'Go to Next Step'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    movetoNext()
                                }
                            })
                        },
                        error: function (xhr, status, error) {
                            Swal.hideLoading()
                            Swal.fire(
                                'Connection failed!',
                                xhr?.responseJSON?.message,
                                'error'
                            )
                        }
                    });
                }
            })
            break;
        case 2:
            Swal.fire({
                title: '',
                text: 'Please wait while we test the SMTP connection using the provided configuration.',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const smtpHost = $('#smtpHost').val()
                    const smtpPort = $('#smtpPort').val()
                    const smtpUsername = $('#smtpUsername').val()
                    const smtpPassword = $('#smtpPassword').val()
                    const smtpTestEmail = $('#smtpTestEmail').val()
                    $.ajax({
                        url: '/install/checkSMTP',
                        method: 'POST',
                        contentType: 'application/json', // Set the content type to JSON
                        data: JSON.stringify({
                            smtpHost,
                            smtpPort,
                            smtpUsername,
                            smtpPassword,
                            smtpTestEmail
                        }),
                        success: function (result) {
                            Swal.hideLoading()
                            Swal.fire({
                                title: 'SMTP Passed',
                                text: 'We are able to send a test email to ' + smtpTestEmail,
                                icon: 'success',
                                confirmButtonText: 'Go to Next Step'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    movetoNext()
                                }
                            })
                        },
                        error: function (xhr, status, error) {
                            Swal.hideLoading()
                            Swal.fire(
                                'SMTP failed!',
                                xhr?.responseJSON?.message,
                                'error'
                            )
                        }
                    });
                }
            })
            break;
        case 3:
            movetoNext()
            break;
        default:
            movetoNext()
            break;
    }
}