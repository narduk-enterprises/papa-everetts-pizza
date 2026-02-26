import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const urls = [
  "https://lh3.googleusercontent.com/p/AF1QipOU1Jqj1GNKo80AhpDFx4opG1OFxACICtFK5c7N=s1200",
  "https://lh3.googleusercontent.com/p/AF1QipM9N72aktptBKBmIuIYC1LXVNOVG6G5Qbilu_gC=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwereP627g0XyR_a_HNMpeVC-VKBo19s5Bo4s0iIpzOXkkojfuIW0PN6ECk8yWZyG2RofD08BXz1zLfhzAn6ZdOnmMvPxQUUPBWyEQPqjsuUvvtKFXD5eCK8k1BTznnvbUIihNlPj39_Db0La=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweotmnt5JAvGvTmFRH6_SQOjqOTGdQSPctfysuEkymVIxgFpKC_-SObEs-9sho_h3NGxXATDFJJWkshKYWyQgZU5-4OEg-zrFjAVAZ-ppmALUoHAZMFdXkdSN_WAu3DIiO01eGshXVrZzren=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerg4l8JPqK-PqmugRu9tz-Z5IaEZ_3-69-_GZzIbWoFyRG28ujXucut3rllj9E83Y_ZR93_iyq45dtXLk6ttcJ_5cvbdwr1vGZenD1w8QKI7oJTcONJpUVs8BcZB61dA3RUtJ7X=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepCdXybkHQVXNsiD5kCtsXVHceE7t1DwQAH-yBzdTmu3edDpbm0uW-d8DPD6u2gxevwJDch6OythOvMNC9l1_qYSuugS-7dbmCtpOO0TNOV8-Q0khCCrO4-FpUX1K7UM4ihsSWgBA=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqGgxsfrXgRalrftaS8uG4TKvZSHeNhRfBKMFfoFwyGylAWo0mMoa0l3P5P8CNfS4dBAIg892GcnYzFh5PZHe_NOZwGEvmg0f9PT4LmUlCUqFxNiOJgPdbv-avcIfBeQ94Azixnrg=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepRF5H5Hm8zNsZRY5fo5SaV6IbZGtpyxEP4UXwtu1u--QlZGrFcbghDH99UKRV0l-mGrwm_bnsLOSH3NdujPLAd7BXD8OkKtbbyGUPat4-kOw2NumXAo3FFLeqjoOzDX708jFzCK5R5L8vt=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqq_-SYDiqFCMmGsHGQhVfn4u4xz1SoVF4Kk0qbizh_6jWusxxMRWv7LZ94qt7PshU-O9jFzNE40jTNqPz_S_sA2nbpf0FdANQ9vAfXIKyD1X8OC8P92V24qxUFfhWRkIj9k_p_=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwer_Nww0AOgd7dsPHa0LNl07pnhU1iAOIOjWLvx2qYHt1Q7XJUJtLml1BnvP14RRRA1fdlsI9ZYXqE1ZWssosMcrbbe5BymUNopCDxI4wn6fCWMPdWLXEnECtlPNBtqrtW4paSchXw=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerOTA8IGt3h8R5PnUcQP8u6D1OYjksg8vjlJ91w0_NKyvSWYTorRsHutQexIXgx5FVYoOSGwx72q9lU0PAjV9psp-OObt9SknIwoCy4jczIfpTlSCiua1El5w7fxSnLwddPzkFUiA=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweooVGiVu2KGmSW1fXggv320cenR7xBlU5zXSLPdSMCfROCyLu8ll1B8BQILAluhENHo0GkffoL6YGy2PyeZzmzqaA-z9PRxuYk4V9UADJ7F3V326NHYy32EPvjHhpJZEetJ8yjE=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepOtFGTKfyvZwW-oBzWmaxuk4QNpIxwW1Q2Jz8nr2zPfiRAuOSRXgp4TZ1vM5EOwpPX8THS1SZLX0expCSiDMjSZNXGciB2i3HGF0GP3bdIT5kYoYzbU42LBFSOmiT1S0-P_hym=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqc-Ry5p3Ui-T_L4x-KTqtAS7a42RL8LdwihRkO0nbWFaZHRFDYF24vHMBoBdEZYbXC95KRVV9pdRZDe4P0QypMBGsmzJSCVI3nSKvPJSdc2no5-cznR6Mj2vq6lwol4R97VYDL=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweolNoAl0zti7o22L82_7JC7rWp1ioCehqNsiTQ8Mnjg1JQTemE4PFa9Wf5vwXNJ3PAltSi03OkcR6pVpqqsQrGcS1L7S6N-I-C-RzS6TTTfJS6bmZ0m7KC-4P5WmBGbk1VPhAHS=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqbIob5_dWCo94-ojJqTZV1CkDoWvqIwUDGubakVXPibjfCwCP-IC7zyO5kIn0KhJBAA--XhIKkmdVPVwRjS2tFyFUptfDBiD32grHAQQ1FOG0xRafsDlzeLfu8kCAYVvIK2CVm=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwep8eX-TBF1iwcfBYt3GiBj-ZFCHBCfgGRZ-pENU8WwFITiedx1yxvvkIUGDh0p6EtbwuUIXPFOO6-g4o68xSZSHzsMVzYSf1MYXFfKUmwqFHB-tmACBpKwLbEhRranJqEp0h2Cz=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqOh45iC8zRQhEkWiw7Va1USPH9T6EE505Fwwj7YvOKMIwWaylm7c0UJsZ1vyv77UV5xWyED2drnn7pRuQr1Hucry_fwklxxLvuEDu14GD0j06wa3sNmTr6gFNNSD2CEABwnU8-=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqni8dW2BaLnCQQYV9RxfK580-0aNCv3Z-D-h0T4_f0OkeO2C3xpNsdEfBf2WIp8PbxF0HFbIHRAVdQW7D-zdCINnYy63sdqbtS-9Zvgjpjb0eU0BiYdhvcj-wOthm_IN9uVsRlUw=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepSV6IHNvqh9fFpfKu4aCFysFVyVlKaxHzfbiOP1F8txXQf1ptfeLhZ7ZE_N8QoCPp6FLch_OOGYUY6-NNJ64i-8A9ACTPSHlTmo-AQvq9VQIJg48gj13jvfZrHpaaqOo7SkowI=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqgrt0PK-ZnMZ7QDh36id5nH3tuN04hOnQTSB5Q0UXxo_jFP1dwAMmgIEF-IKjKvzdMRPfqJMeIjItmiJnC0NyNiewetfIFS1GlJmjCUtcJ55eJ-cL7D_qgYtqyN99A6DWhrR2Y=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoRaDWX8NuqiyFYElgQM6pKitn2PSiE_irrNkacezHYeCk6LBLL3YWDaNI9djWUG7Ov-qZwEAfAtY4hQm4id31i-2XBNVALahvw_lZfHJOViU_iQd4eT95dhbbUwtUyPQG7CpD0=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoNVfQ3Pj_Ykdm57x1ZDj02QRNdT5sCGJu3G-1hieaXvfhS68bQRwQm9oIW9IN6dO7DKMs9Oew2bBJxnX8wXnEGsKOrsJHmZrsYyU7PksUclGe1Rth0ti7eCxRKAXowJ1orWedtOA=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqmXGIxK1G894oLz4jsYfg6EOfbiItgxrZCXQK1JAKsWJ8xM9IlCc9cU2VJQfFK6f3pbi_awa0vlmnnefQZ7gVrK8q1gWRC8pxENerz3p-HaghYWx1njbwqoqPF08haIkExlek=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerAAAFvMqn7xEhexRby0CzHUxAj2qZ8RczzZ0I04T_LbxHmekLC5xMfvqEgaU9hJcNWWfleAuxZIJNbGVTcTjyzyruhXEEIfnRoaWPOquJXgSsT8QURJ9WW2sDDPv-cLCf4nfd4NQ=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqZhqpDlF-CQKmbhPFhGHTg_AIf-YL7HhOpBVCowEDtnk_NLX8U2krZEBh01URrJ5IMIQ5f6AaeIiKXZkdKWigdgPj-peW_14tSn93B8VPw3_1RiCMeSbL8juyYowA-OEl-xrJG=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepcNqwlLM1b6Vy-BFuTgXQY27iWR3rnQ5gLjX5oP7QiZ2oEVfh76a9KZcIrL7eHFtq9NWHYKcTgsaNBt_polixmlCAtXq2DbQ9AuUQFq0aeR-N4u6h6fKyiGH9Z32OtjyLVklVf=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweofbx6bnixsDJwvFnZ9Un9pJetipW6d3qDHdoa3ABHw6XcnTYZcWoJHtPQ950Zz_abNSDinjt0ulIyhTioUwfjjcrigYHXk8mX95mf6Lculc3bxc0VaFnt1sio5JFSeL7YPHpoe=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoja4Sr-KFmixVVvZ_Qsy4cHIVS6XTf0qnrSRD3GpDYOU0L0AH7O3URNSjHmXZhSiOHPNUojk0f-nzhpmT09JcpZayLmzHKIWmR2KgSP0Wq6b-iom5iUb4GtXTCrkbdQlvhzHcz=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoY9-YCxHQs8zMq4GmlL0wUEECgGt17s7IHMYRDdLQrdSx1cM-El2F7kFUnXQmAYF-juVQ5Nyj3Kl9DAn2F15So8VTSLYPmYNR9CCiT1uEkwZvtyRv5b1mt18ao9uU_sIltoGH7Rw=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepnV_k77HM0GTiCT3UbJPadAQgE8QDQGyF9Fdzvwx_6lbrqLPtDBOcnmDUepANZpJkZqMBLh2rAUWzG6wYWWu8eoOaTjx7u1gWtW3FjMWcDvXYaBXFhw__WmZc2eANpM8s9Khvr=s1200",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerRYlDwAwh0c_MZZFbEgJ4J7IeVT9yDUDy4AmpNWt8WJIn18WYcOs6boC9t8-WmdAmf0yH3GtorC7i2DLqqpvMzDlfKgfAhaVSwnoHPc_U_EzUq4Ul4RzgH_xQym5WqKOnJ3_dMNOY1Aa1z=s1200"
]

const outputDir = path.join(__dirname, '..', 'public', 'images', 'food')

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(download(response.headers.location, filePath))
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      const file = fs.createWriteStream(filePath)
      response.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', (err) => {
      fs.unlink(filePath, () => reject(err))
    })
  })
}

async function fetchAll() {
  console.log('Downloading 31 authentic Google Maps images locally...')
  let i = 1
  for (const url of urls) {
    const filename = `gm-photo-${i.toString().padStart(2, '0')}.jpg`
    const dest = path.join(outputDir, filename)
    try {
      await download(url, dest)
      console.log(`Saved ${filename}`)
    } catch (e) {
      console.error(`Failed to save ${filename}:`, e.message)
    }
    i++
  }
  console.log('Complete.')
}

fetchAll()
