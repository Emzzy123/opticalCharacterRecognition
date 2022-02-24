import React, { Component } from "react";
import FileBase64 from "react-file-base64";
import { Button, Form, FormGroup, Label, FormText, Input } from "reactstrap";
import "./upload.css";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmation: "",
      isLoading: "",
      files: "",
      Invoice: "",
      Amount: "",
      InvoiceDate: "",
      Retailer: "",
      Details: "",
      id: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  //Get Handle
  async onSubmit(e) {
    e.preventDefault();
    console.log(e);
    const params = {
      id: this.state.id,
      Invoice: this.state.Invoice,
      Amount: this.state.Amount,
      InvoiceDate: this.state.InvoiceDate,
      Retailer: this.state.Retailer,
      Details: this.state.Details,
    };

    await fetch(
      "https://7hzo4iaekk.execute-api.eu-west-2.amazonaws.com/Production/invoice",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(params),
      }
    );

    this.setState({
      confirmation: "File uploaded 😏",
    });
  }

  //Target Image
  handleChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  //Async Get File
  async getFiles(files) {
    this.setState({
      isLoading: "Extracting data",
      files: files,
    });

    const UID = Math.round(1 + Math.random() * (1000000 - 1));

    let data = {
      fileExt: "png",
      imageID: UID,
      folder: UID,
      img: this.state.files[0].base64,
    };
    this.setState({ confirmation: "File Processing 😁..." });
    await fetch(
      "https://3cx54r6z08.execute-api.eu-west-2.amazonaws.com/Production",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(data),
      }
    );

    let targetImage = UID + ".png";
    const response = await fetch(
      "https://3cx54r6z08.execute-api.eu-west-2.amazonaws.com/Production/ocr",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(targetImage),
      }
    );
    this.setState({ confirmation: "" });
    const OCR_Body = await response.json();
    console.log("OCR_Body", OCR_Body);
    this.setState({ Amount: OCR_Body.body[0] });
    this.setState({ Invoice: OCR_Body.body[1] });
    this.setState({ InvoiceDate: OCR_Body.body[2] });
  }

  render() {
    const processing = this.state.confirmation;
    return (
      <div className="main">
        <div className="glass">
          <div>
            <div className="col-6 offset-3">
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <br />
                  <h3 className="text-info">{processing}</h3>
                  <h5>Submit Your Invoice 📰📃📜</h5>
                  <FormText color="muted">PNG, JPG</FormText>

                  <div className="form-group files color">
                    <FileBase64
                      multiple={true}
                      onDone={this.getFiles.bind(this)}
                    ></FileBase64>
                  </div>
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>
                    <h6>ID</h6>
                  </Label>
                  <Input
                    placeholder="Please enter ID"
                    type="text"
                    name="id"
                    id="id"
                    required
                    value={this.state.id}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>
                    <h6>Invoice</h6>
                  </Label>
                  <Input
                    placeholder="Please enter invoice"
                    type="text"
                    name="Invoice"
                    id="Invoice"
                    required
                    value={this.state.Invoice}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>
                    <h6>Total Amount</h6>
                  </Label>
                  <Input
                    placeholder="Please enter amount"
                    type="text"
                    name="Amount"
                    id="Amount"
                    required
                    value={this.state.Amount}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>
                    <h6>Date</h6>
                  </Label>
                  <Input
                    placeholder="Please enter date"
                    type="text"
                    name="InvoiceDate"
                    id="InvoiceDate"
                    required
                    value={this.state.InvoiceDate}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>
                    <h6>Retailer</h6>
                  </Label>
                  <Input
                    placeholder="Please enter retailer name"
                    type="text"
                    name="Retailer"
                    id="Retailer"
                    required
                    value={this.state.Retailer}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label>
                    <h6>Details</h6>
                  </Label>
                  <Input
                    placeholder="Please enter detail"
                    type="text"
                    name="Details"
                    id="Details"
                    required
                    value={this.state.Detail}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <br />
                <Button className="btn btn-lg btn-block  btn-success">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;
