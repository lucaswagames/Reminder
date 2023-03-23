import styles from "./footer.module.css"
import Head from "next/head"

export default function Footer() {
  return (

    <>
      <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      </Head>

      <footer className={styles.footer}>
        <hr />
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            LUCAS CHARBONNIER
          </li>
          <li>
            2023
          </li>
        </ul>
      </footer></>
  )
}
