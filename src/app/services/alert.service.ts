import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  app: object;
  device: object;

  constructor(
    private alertController: AlertController,
    private lc: LoadingController
  ) {}

  error(error: Error | object) {
    // If undefined object
    const data = {};
    data['code'] = error['code'] ? error['code'] : '666';
    data['message'] = error['message'] ? error['message'] : error;
    // Create alert
    this.alertController
      .create({
        header: 'Error',
        subHeader: data['code'],
        message: data['message'],
        buttons: [
          {
            text: 'Send Error Report',
            handler: () => {} // TODO: Send email as handler
            // this.sendEmail('k173673@nu.edu.pk',
            // 'Bug Report (FAST CarPool)',
            // `Device:\n${JSON.stringify(this.device)}\n
            // App:\n${JSON.stringify(this.app)}\nCode: ${data['code']}\nMessage: ${data['message']}`)
          },
          'Okay'
        ]
      })
      .then(alert => {
        alert.present();
      });
  }

  // sendEmail(to: string, subject: string, body: string) {
  //   this.emailComposer.isAvailable().then((available) => {
  //     if (available) {
  //       // Now we know we can send
  //       const email = {
  //         to: to,
  //         subject: subject,
  //         body: body
  //       };
  //       // Send a text message using default options
  //       this.emailComposer.open(email);
  //     } else throw new Error('Email Composer not available');
  //   }).catch(err => {
  //     this.notice(err);
  //   });
  // }

  // Takes a message as the first argument and displays it for confirmation
  // The second arguments is a confirmation handler which is triggered if the user presses yes
  async confirmation(message: string, confirmationHandler: any) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message,
      buttons: [
        {
          text: 'Yes',
          handler: confirmationHandler
        },
        'No' // No Action
      ]
    });

    await alert.present();
  }

  async notice(message: string) {
    const alert = await this.alertController.create({
      header: 'Message',
      message,
      buttons: ['Okay']
    });

    await alert.present();
  }

  // Takes a message to be shown on the loading screen
  // Second argument is the work to be done as a promise
  async load(message: string, work: Promise<any>, time = 5000) {
    if (time > 2147483647) time = 2147483647; // Max Delay
    // Set timer to resolve if taking too long (5 seconds)
    let timer: any; // NodeJS.Timeout;
    const timeout = new Promise(resolve => {
      timer = setTimeout(() => {
        console.log('Timeout');
        return resolve();
      }, time);
    });

    // Pass message into loading screen
    const loadingScreen = await this.lc.create({
      message
    });
    await loadingScreen.present();

    try {
      // Create a race between work and timeout
      // If timeout happens first, it will console.log and end the loading screen
      // However the work keeps happening in the background even after timeout
      // TODO: Handle timeout
      return await Promise.race([work, timeout]);
    } catch (error) {
      // Throw error
      throw error;
    } finally {
      // In any case
      // If work happens first
      clearTimeout(timer);
      // Dismiss the loading screen
      this.lc.dismiss(null, null, loadingScreen.id);
    }
  }
}
