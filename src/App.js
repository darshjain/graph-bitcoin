import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import ReactDOM from 'react-dom'
import BitcoinNetworkGraph from './components/BitcoinNetworkGraph'

const useQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const address = searchParams.get('address')
  return { address }
}

const App = () => {
  const [data, setData] = useState({
    bitcoin: {
      bitcoin: {
        inbound: [
          {
            sender: {
              address: 'bc1pnmqx73tt5egp3kr9822dx3tsx5wxt8g9ze8cup0jnt5qehrkuhwq7w5pl3',
              annotation: null,
            },
            receiver: {
              address: 'bc1paqxclg20cqxqyuknz08y8z3822s3v2pdrnrtkkx4k872ygqf7m5seuwxhj',
              annotation: null,
            },
            amount: 0.00001135,
            depth: 1,
            count: 1,
          },
          {
            sender: {
              address: 'bc1qe0hnfqr9ez2gj89mns5g4hju54g6hcesyhrgzw',
              annotation: null,
            },
            receiver: {
              address: 'bc1pnmqx73tt5egp3kr9822dx3tsx5wxt8g9ze8cup0jnt5qehrkuhwq7w5pl3',
              annotation: null,
            },
            amount: 0.00001135,
            depth: 2,
            count: 1,
          },
        ],
        outbound: [],
      },
    },
  })

  const { address } = useQueryParams()

  const fetchData = async () => {
    const query = JSON.stringify({
      query: `query ($network: BitcoinNetwork!, $address: String!, $inboundDepth: Int!, $outboundDepth: Int!, $limit: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
        bitcoin(network: $network) {
          inbound: coinpath(
            initialAddress: { is: $address }
            depth: { lteq: $inboundDepth }
            options: {
              direction: inbound
              asc: "depth"
              desc: "amount"
              limitBy: { each: "depth", limit: $limit }
            }
            date: { since: $from, till: $till }
          ) {
            sender {
              address
              annotation
            }
            receiver {
              address
              annotation
            }
            amount
            depth
            count
            transaction {
              hash
            }
          }
          outbound: coinpath(
            initialAddress: { is: $address }
            depth: { lteq: $outboundDepth }
            options: {
              asc: "depth"
              desc: "amount"
              limitBy: { each: "depth", limit: $limit }
            }
            date: { since: $from, till: $till }
          ) {
            sender {
              address
              annotation
            }
            receiver {
              address
              annotation
            }
            amount
            depth
            count
            transaction {
              hash
            }
          }
        }
      }`,
      variables: `{
        "inboundDepth": 4,
        "outboundDepth": 4,
        "limit": 10,
        "offset": 0,
        "network": "bitcoin",
        "address": "${address}",
        "from": "2023-07-11",
        "till": "2023-07-18T23:59:59",
        "dateFormat": "%Y-%m-%d"
      }`,
    })

    const config = {
      method: 'post',
      url: 'https://graphql.bitquery.io',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'BQYTMArK4Wm5UWFqi0uCKSgJQAOiMUEb',
      },
      data: query,
    }

    const response = await axios(config)
    setData(response.data.data)
    console.log(response.data.data)
  }

  useEffect(() => {
    fetchData()
  }, [address])

  return (
    <div>
      <BitcoinNetworkGraph data={ data } />
    </div>
  )
}

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={ <App /> } />
    </Routes>
  </Router>,
  document.getElementById('root')
)

export default App