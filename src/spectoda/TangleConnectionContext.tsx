import { createContext, useEffect, useState } from "react"
import { spectodaDevice } from "./communication"
// import { spectodaDevice } from "./lib/utils/communication";

interface ConnectionContext {
  connectionStatus: "connected" | "disconnected"
  connect: Function
  disconnect: Function
  adopt: Function
  isActiveMac: Function
  isConnecting: boolean
  connectedMacs: { mac: string }[]
  disconnectedMacs: { mac: string }[]
}

// @ts-ignore
const TangleConnection = createContext<ConnectionContext>()

const TangleConnectionProvider = ({ children }: any) => {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected"
  >("disconnected")
  const [isAdopting, setIsAdopting] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedMacs, setConnectedMacs] = useState<any[]>([])
  const [disconnectedMacs, setDisconnectedMacs] = useState<any[]>([])

  // console.log("macs", connectedMacs, disconnectedMacs);

  const getAndSetPeers = () => {
    spectodaDevice.getConnectedPeersInfo().then((peers: any) => {
      setConnectedMacs(peers)
      setDisconnectedMacs((macs) => {
        return macs.filter((v) => peers.find((p: any) => p.mac !== v.mac))
      })
      console.log({ peers })
    })
  }

  useEffect(() => {
    let interval
    spectodaDevice.on("connected", (event: any) => {
      if (connectionStatus !== "connected") {
        setConnectionStatus("connected")
        console.log("connected device", event)

        getAndSetPeers()
        // clearInterval(interval);
        // interval = setInterval(getAndSetPeers, 10000)

        setTimeout(async () => {
          window.localStorage.setItem("login_pass", "true")
        }, 300)
      }
    })

    spectodaDevice.on("disconnected", (event: any) => {
      // @ts-ignore
      setConnectionStatus("disconnected")

      setConnectedMacs((macs) => {
        console.log(JSON.stringify(disconnectedMacs), JSON.stringify(macs))
        setDisconnectedMacs((disconnectedMacs) => {
          console.log(
            "Settings macs...",
            JSON.stringify([disconnectedMacs, macs])
          )

          const key = "mac"
          const allmacs = [...disconnectedMacs, ...macs]
          const arrayUniqueByKey = [
            // @ts-ignore
            ...new Map(allmacs.map((item) => [item[key], item])).values(),
          ]

          return arrayUniqueByKey
        })
        return []
      })
    })

    spectodaDevice.on("peer_connected", (peer: any) => {
      console.log("peer_connected", peer)

      setConnectedMacs((macs) => [...macs, { mac: peer }])
      setDisconnectedMacs((macs) => {
        return macs.filter((v) => v.mac !== peer)
      })
    })

    spectodaDevice.on("peer_disconnected", (peer: any) => {
      console.log("peer_disconnected", peer)

      setConnectedMacs((macs) => {
        return macs.filter((v) => v.mac !== peer)
      })

      setDisconnectedMacs((macs) => {
        if (!macs.find((p) => p.mac === peer)) {
          macs = [...macs, { mac: peer }]
        }
        console.log("peer___disconnected")
        return macs
      })
    })
  }, [])

  const connect = async function () {
    try {
      setIsConnecting(true)
      const info = await spectodaDevice
        .connect(null, false, null, null, true)
        .catch(() => {})
      console.log({ info })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async function () {
    try {
      setIsConnecting(true)
      await spectodaDevice.disconnect()
    } finally {
      setIsConnecting(false)
    }
  }

  const adopt = async (...params: any) => {
    setIsAdopting(true)
    let device
    try {
      device = await spectodaDevice.adopt(...params).catch(() => {})
    } finally {
      setIsAdopting(false)
    }
    return device
  }

  const isActiveMac = (mac: string) => {
    return !!connectedMacs.find((v) => v.mac === mac)
  }

  return (
    <TangleConnection.Provider
      value={{
        connectionStatus,
        connect,
        disconnect,
        adopt,
        isActiveMac,
        isConnecting,
        connectedMacs,
        disconnectedMacs,
      }}
    >
      {children}
    </TangleConnection.Provider>
  )
}

export { TangleConnectionProvider, TangleConnection }

function selectRandomItemFromArray(array: any[]) {
  return array[Math.floor(Math.random() * array.length)]
}

function czechHackyToEnglish(string: string) {
  return string
    .replace(/č/g, "c")
    .replace(/š/g, "s")
    .replace(/ř/g, "r")
    .replace(/ž/g, "z")
    .replace(/ý/g, "y")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ů/g, "u")
    .replace(/ě/g, "e")
    .replace(/ť/g, "t")
    .replace(/ď/g, "d")
    .replace(/ň/g, "n")
    .replace(/Š/g, "S")
    .replace(/Ž/g, "Z")
    .replace(/Ý/g, "Y")
    .replace(/Á/g, "A")
    .replace(/É/g, "E")
    .replace(/Í/g, "I")
    .replace(/Ó/g, "O")
    .replace(/Ú/g, "U")
    .replace(/Ů/g, "U")
    .replace(/Ě/g, "E")
    .replace(/Ť/g, "T")
    .replace(/Ď/g, "D")
    .replace(/Ň/g, "N")
}
