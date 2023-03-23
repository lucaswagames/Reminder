import Layout from "../components/layout"

export default function Home() {
  return (
    <Layout>
      <center>
        <h1 >Welcome to Remindr</h1> <br />

        <div style={{background: '#e6e6e6', padding: '10px', borderRadius: '5px'}} >
          <h2>Description</h2>
          <p>
            Remindr is a web application that lets you create reminders and share them with your friends. <br />
            You can create groups and invite your friends to join them. <br />
            You can also create private reminders that will only be visible to you. <br />
            You can also create public reminders that will be visible to all Remindr users. <br />
          </p>

          <br />

          <h2>How it works ?</h2>
          <p> Connect with GitHub and you good 👌 </p>
          <br />
        </div>
      </center>

    </Layout>
  )
}


