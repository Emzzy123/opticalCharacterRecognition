import "./upload.css";
import React from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
// import qs from "qs";

class InvoiceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: [],
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://7hzo4iaekk.execute-api.eu-west-2.amazonaws.com/Production/invoices"
      )
      .then((response) => {
        this.setState({
          invoices: response.data.invoices,
        });
        console.log(this.state.invoices);
      });
  }
  remove(id) {
    console.log(id);
    let updateedInvoices = [...this.state.invoices].filter((i) => i.id !== id);

    this.setState({ invoices: updateedInvoices });
  }

  render() {
    let { invoices } = this.state;

    return (
      <div className="main1 row">
        <div className="glass1">
          <div>
            <div className="col-sm-6 offset-sm-3">
              <br />
              <center>
                <h1>Invoice Record</h1>
              </center>
              <br />
              <Table
                style={{
                  textAlign: "center",
                }}
              >
                <tr
                  style={{
                    fontSize: 25,
                    backgroundColor: "rgb(129, 156, 230)",
                    color: "white",
                  }}
                >
                  <td>
                    <strong>ID</strong>
                  </td>

                  <td>
                    <strong>Invoice</strong>
                  </td>

                  <td>
                    <strong>Amount</strong>
                  </td>

                  <td>
                    <strong>InvoiceDate</strong>
                  </td>

                  <td>
                    <strong>Retailer</strong>
                  </td>

                  <td>
                    <strong>Details</strong>
                  </td>
                  {/* <td>
                <strong>Delete Invoice</strong>
              </td> */}
                </tr>
                {invoices.map((invoice) => (
                  <tr
                    style={{
                      border: "1px dotted black",
                      backgroundColor: "white",
                    }}
                    key={invoice.id}
                  >
                    <td>{invoice.id}</td>

                    <td>{invoice.Invoice}</td>

                    <td>{invoice.Amount}</td>

                    <td>{invoice.InvoiceDate}</td>

                    <td>{invoice.Retailer}</td>

                    <td>{invoice.Details}</td>

                    {/* <td>
                  <button
                    style={{ backgroundColor: "red", borderRadius: "14px" }}
                    onClick={() => this.remove(invoice.id)}
                  >
                    Delete
                  </button>
                </td> */}
                  </tr>
                ))}
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceList;
