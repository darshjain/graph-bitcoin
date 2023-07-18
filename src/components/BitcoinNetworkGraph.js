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

    const uniqueIds = new Set() // Track unique IDs

    const inboundNodes = data.bitcoin.inbound.map((transaction) => {
      const id = transaction.sender.address
      uniqueIds.add(id)
      return {
        id,
        label: id,
        color: '#ff5722',
      }
    })

    const outboundNodes = data.bitcoin.outbound.map((transaction) => {
      const id = transaction.receiver.address
      uniqueIds.add(id)
      return {
        id,
        label: id,
        color: '#2196f3',
      }
    })

    const nodes = new DataSet([...inboundNodes, ...outboundNodes])

    const inboundEdges = data.bitcoin.inbound.map((transaction) => ({
      from: transaction.sender.address,
      to: transaction.receiver.address,
    }))

    const outboundEdges = data.bitcoin.outbound.map((transaction) => ({
      from: transaction.sender.address,
      to: transaction.receiver.address,
    }))

    const edges = new DataSet([...inboundEdges, ...outboundEdges])

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
