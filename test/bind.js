const myButton = {
    content: 'OK',
    click() {
      console.log(this)
      console.log(this.content + ' clicked');
    },
    yourButton: {
        content: 'no',
        click() {
            console.log(this)
            console.log(this.content + ' clicked');
        }
    }
  };
  
  myButton.click();
  const binded = myButton.click.bind(myButton);
  binded();
  const window = myButton.click
  window();
//   myButton.yourButton.click();