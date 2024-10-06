import Footer from "@/components/Footer";
import { IconChevronDown } from "@tabler/icons-react";
import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us</title>
      </Head>
      <div>
        {/* Main Content */}
        <main className="px-4 mt-16 space-y-20">
          <div className="container mx-auto">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                About Us
              </h2>
              <p className="mt-2 text-lg leading-8 opacity-80">
                Aute magna irure deserunt veniam aliqua magna enim voluptate.
              </p>
            </div>
            <div className="container max-w-6xl mx-auto mt-16 space-y-10 text-lg text-center sm:mt-20">
              <p>
                We are committed to promoting and tracking sustainable tree
                plantation across the world. Our mission is to increase the life
                span of trees by maximizing the possibilities of their growth
                and providing a platform for individuals, NGOs, and government
                bodies to work together towards a greener future.
              </p>
              <p>
                We offer a comprehensive platform that allows individuals and
                organizations to track their tree plantation activities, monitor
                the growth of their trees, and collaborate with other
                like-minded people to achieve a common goal. Our platform uses
                the latest technologies to collect data and provide actionable
                insights that can help in making informed decisions about tree
                plantation.
              </p>
              <p>
                Our team at FR CRCE is made up of dedicated professionals who
                are passionate about creating a sustainable future. We are
                constantly exploring new ways to innovate and improve our
                platform so that we can provide the best possible experience to
                our users.
              </p>
            </div>
          </div>

          <ContactUs />
        </main>
        <Footer />
      </div>
    </>
  );
}

function BackgroundAsset() {
  return (
    <div
      className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      aria-hidden="true"
    >
      <div
        className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
}

function ContactUs() {
  return (
    <div className="relative px-6 py-24 sm:py-32 lg:px-8">
      <BackgroundAsset />
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h2>
        <p className="mt-2 text-lg leading-8 opacity-80">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>
      <form className="max-w-6xl mx-auto mt-16 sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="form-control">
            <label htmlFor="first-name" className="label">
              First name
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              className="w-full bg-transparent input input-bordered"
            />
          </div>
          <div className="form-control">
            <label htmlFor="last-name" className="label">
              Last name
            </label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              autoComplete="family-name"
              className="w-full bg-transparent input input-bordered"
            />
          </div>
          <div className="sm:col-span-2 form-control">
            <label htmlFor="company" className="label">
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              autoComplete="organization"
              className="w-full bg-transparent input input-bordered"
            />
          </div>
          <div className="sm:col-span-2 form-control">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              className="w-full bg-transparent input input-bordered"
            />
          </div>
          <div className="sm:col-span-2 form-control">
            <label htmlFor="phone-number" className="label">
              Phone number
            </label>
            <div className="input-group">
              <select
                id="country"
                name="country"
                className="select select-bordered"
              >
                <option>US</option>
                <option>CA</option>
                <option>EU</option>
                <option>IN</option>
              </select>
              <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                className="w-full bg-transparent input input-bordered"
              />
            </div>
          </div>
          <div className="sm:col-span-2 form-control">
            <label htmlFor="message" className="label">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              className="bg-transparent textarea textarea-bordered"
              defaultValue={""}
            />
          </div>
        </div>

        <div className="mt-6 form-control">
          <button type="submit" className="btn btn-primary">
            Let's talk
          </button>
        </div>
      </form>
    </div>
  );
}
