import React, { useEffect, useRef } from 'react'
import { DataSet } from 'vis-data'
import { Network } from 'vis-network'

const BitcoinNetworkGraph = ({ data }) => {
  const containerRef = useRef(null)
  const networkRef = useRef(null)

  useEffect(() => {
    if (!data || !data.bitcoin || !data.bitcoin.inbound || !data.bitcoin.outbound) {
      return
    }

    const uniqueAddresses = new Set() // Track unique addresses
    const nodes = new DataSet()
    const edges = new DataSet()

    // Create nodes and edges for inbound transactions
    data.bitcoin.inbound.forEach((transaction) => {
      const senderAddress = transaction.sender.address
      const receiverAddress = transaction.receiver.address

      // Add sender node if not already present
      if (!uniqueAddresses.has(senderAddress)) {
        nodes.add({
          id: senderAddress,
          label: senderAddress,
          color: '#ff5722',
        })
        uniqueAddresses.add(senderAddress)
      }

      // Add receiver node if not already present
      if (!uniqueAddresses.has(receiverAddress)) {
        nodes.add({
          id: receiverAddress,
          label: receiverAddress,
          color: '#2196f3',
        })
        uniqueAddresses.add(receiverAddress)
      }

      // Add edge between sender and receiver
      edges.add({
        from: senderAddress,
        to: receiverAddress,
      })
    })

    // Create nodes and edges for outbound transactions
    data.bitcoin.outbound.forEach((transaction) => {
      const senderAddress = transaction.sender.address
      const receiverAddress = transaction.receiver.address

      // Add sender node if not already present
      if (!uniqueAddresses.has(senderAddress)) {
        nodes.add({
          id: senderAddress,
          label: senderAddress,
          color: '#ff5722',
        })
        uniqueAddresses.add(senderAddress)
      }

      // Add receiver node if not already present
      if (!uniqueAddresses.has(receiverAddress)) {
        nodes.add({
          id: receiverAddress,
          label: receiverAddress,
          color: '#2196f3',
        })
        uniqueAddresses.add(receiverAddress)
      }

      // Add edge between sender and receiver
      edges.add({
        from: senderAddress,
        to: receiverAddress,
      })
    })

    const graphData = {
      nodes,
      edges,
    }

    const options = {
      layout: {
        hierarchical: false,
      },
      physics: {
        enabled: true,
      },
      nodes: {
        shape: 'dot',
        size: 10,
      },
      edges: {
        smooth: {
          type: 'continuous',
        },
      },
    }

    const network = new Network(containerRef.current, graphData, options)
    networkRef.current = network

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy()
        networkRef.current = null
      }
    }
  }, [data])

  return <div ref={ containerRef } style={ { height: '1000px' } } />
}

export default BitcoinNetworkGraph
