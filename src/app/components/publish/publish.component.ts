import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Lecture } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  authorized: boolean;
  @Input() timetable: Array<Lecture>;

  constructor() {
    this.authorized = false;
  }

  ngOnInit() {
    // Load gapi client library
    gapi.load('client', this.init);

    // async function start() {
    //   try {
    //     const API_QUERY = 'android';
    //     // 3. Make the API request.
    //     const apiRequest = await gapi.client.discovery.apis.list();
    //     const result = JSON.parse(apiRequest.body);

    //     // 4. Log the results of the API request
    //     const androidAPIs = result.items.filter(api => api.id.startsWith(API_QUERY));
    //     const androidAPITitles = androidAPIs.map(api => api.title);
    //     const uniqueAndroidAPITitles = [...new Set(androidAPITitles).values()];
    //     document.getElementById('result').innerHTML =
    //       `${uniqueAndroidAPITitles.length} APIs:<br>${uniqueAndroidAPITitles.join('<br/> ')}`;
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  }

  init() {
    gapi.client.load('sheets', 'v4', () => {
      // now we can use gapi.client.sheets
      // ...
      gapi.auth.authorize(
        {
          client_id: environment.googleSheetsConfig.clientId,
          scope: environment.googleSheetsConfig.scope
        },
        authResult => {
          if (authResult && !authResult.error) {
            // TODO: this.authorized = true;
            /* handle successful authorization */
            /*
Applies one or more updates to the spreadsheet.

Each request is validated before
being applied. If any request is not valid then the entire request will
fail and nothing will be applied.

Some requests have replies to
give you some information about how
they are applied. The replies will mirror the requests.  For example,
if you applied 4 updates and the 3rd one had a reply, then the
response will have 2 empty replies, the actual reply, and another empty
reply, in that order.

Due to the collaborative nature of spreadsheets, it is not guaranteed that
the spreadsheet will reflect exactly your changes after this completes,
however it is guaranteed that the updates in the request will be
applied together atomically. Your changes may be altered with respect to
collaborator changes. If there are no collaborators, the spreadsheet
should reflect your changes.
*/
            // await gapi.client.spreadsheets.batchUpdate({ spreadsheetId: "spreadsheetId",  });

            /*
Creates a spreadsheet, returning the newly created spreadsheet.
*/
            // await gapi.client.spreadsheets.create({  });

            /*
Returns the spreadsheet at the given ID.
The caller must specify the spreadsheet ID.

By default, data within grids will not be returned.
You can include grid data one of two ways:

* Specify a field mask listing your desired fields using the `fields` URL
parameter in HTTP

* Set the includeGridData
URL parameter to true.  If a field mask is set, the `includeGridData`
parameter is ignored

For large spreadsheets, it is recommended to retrieve only the specific
fields of the spreadsheet that you want.

To retrieve only subsets of the spreadsheet, use the
ranges URL parameter.
Multiple ranges can be specified.  Limiting the range will
return only the portions of the spreadsheet that intersect the requested
ranges. Ranges are specified using A1 notation.
*/
            gapi.client.sheets.spreadsheets
              .get({
                spreadsheetId: '1sq55sYHHZfuLxgjxAp8if-rwMeesjMqzR_P8ffh7rdw'
              })
              .then(console.log);

            /*
Returns the spreadsheet at the given ID.
The caller must specify the spreadsheet ID.

This method differs from GetSpreadsheet in that it allows selecting
which subsets of spreadsheet data to return by specifying a
dataFilters parameter.
Multiple DataFilters can be specified.  Specifying one or
more data filters will return the portions of the spreadsheet that
intersect ranges matched by any of the filters.

By default, data within grids will not be returned.
You can include grid data one of two ways:

* Specify a field mask listing your desired fields using the `fields` URL
parameter in HTTP

* Set the includeGridData
parameter to true.  If a field mask is set, the `includeGridData`
parameter is ignored

For large spreadsheets, it is recommended to retrieve only the specific
fields of the spreadsheet that you want.
*/
            // await gapi.client.spreadsheets.getByDataFilter({ spreadsheetId: "spreadsheetId",  });
          } else {
            /* handle authorization error */
            console.log(authResult.error);
          }
        }
      );
    });
  }
}
