<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket - {{ $ticket->ticket_code }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; }
        .ticket-container { border: 2px dashed #990000; padding: 20px; border-radius: 10px; margin-top: 20px; }
        .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
        .event-title { font-size: 24px; font-weight: bold; color: #990000; text-transform: uppercase; }
        .details-table { w-full: 100%; width: 100%; }
        .details-table td { vertical-align: top; }
        .info-block { margin-bottom: 15px; }
        .info-label { font-size: 10px; text-transform: uppercase; color: #777; letter-spacing: 1px; }
        .info-value { font-size: 16px; font-weight: bold; }
        .qr-container { text-align: center; }
        .qr-code { border: 1px solid #eee; padding: 10px; border-radius: 5px; }
        .ticket-code { text-align: center; font-size: 12px; margin-top: 10px; letter-spacing: 2px; }
        .disclaimer { font-size: 10px; color: #555; margin-top: 20px; border: 1px solid #990000; padding: 5px; border-radius: 5px; text-align: center;}
        .sigil-logo { text-align: center; margin-top: 15px; margin-bottom: 5px; }
        .sigil-endtext { text-align: center; font-size: 10px; color: #555; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="header">
            <div class="event-title">{{ $ticket->event->title }}</div>
            <div>{{ \Carbon\Carbon::parse($ticket->event->start_time)->format('l, F j, Y \a\t g:i A') }}</div>
        </div>

        <table class="details-table">
            <tr>
                <td style="width: 60%;">
                    <div class="info-block">
                        <div class="info-label">Venue</div>
                        <div class="info-value">{{ $ticket->event->venue->name }}</div>
                        <div style="font-size: 12px; color: #555;">{{ $ticket->event->venue->city }}, {{ $ticket->event->venue->address }}</div>
                    </div>

                    <div class="info-block">
                        <div class="info-label">Ticket Type & Price</div>
                        <div class="info-value">{{ $ticket->ticketType->name }} - {{ number_format($ticket->paid_amount, 0, '', ' ') }} {{ strtoupper($ticket->currency) }}</div>
                    </div>

                    <div class="info-block">
                        <div class="info-label">Placement</div>
                        <div class="info-value">
                            Section: {{ $ticket->section }}<br>
                            @if($ticket->row !== null && $ticket->column !== null)
                                Row: {{ $ticket->row + 1 }} | Seat: {{ $ticket->column + 1 }}
                            @else
                                {{ $ticket->ticketType->name }}
                            @endif
                        </div>
                    </div>
                </td>
                <td style="width: 40%;" class="qr-container">
                    <img src="data:image/svg+xml;base64,{{ $qrCode }}" class="qr-code">
                    <div class="ticket-code">{{ $ticket->ticket_code }}</div>
                </td>
            </tr>
        </table>
        <div class="disclaimer">
            <p>
                Terms and Conditions: By purchasing this ticket, the ticket holder accepts the Rules and Regulations of the event which can be found on the Promoter's website or at the venue. Tickets are void if mutilated or damaged. Ticket counterfeiting is an offense under the Hungarian criminal law and will be prosecuted. Please note, if the event is cancelled of postponed, only the Event Promoter can be held responsible to declare the terms of ticket refunds. The Promoter reserves the right of any program changes.
            </p>
        </div>

        <div class="sigil-logo">
            @php
                $logoPath = public_path('images/sigil-logo.jpg');
                
                $logoData = @file_get_contents($logoPath);
                $logoBase64 = $logoData ? base64_encode($logoData) : '';
            @endphp
            
            @if($logoBase64)
                <img src="data:image/jpeg;base64,{{ $logoBase64 }}" width="120" height="120" alt="Sigil Logo">
            @endif
        </div>
        <div class="sigil-endtext">
            <p>
                Sigil Hungary Ltd. // {{ date('Y') }} // All Rights Reserved
            </p>
        </div>  
    </div>
</body>
</html>