import PageTitle from "../components/PageTitle";

function ContactUsPage() {
  return (
    <>
      <PageTitle title="Contact Us" />
      <div className="p-container content">
        <p>
          Got any questions about this website? Do you have feedback or
          suggestions?
        </p>
        <p>
          Feel free to contact us at{" "}
          <a href="mailto:contactus@moode.com">contactus@moode.com</a>
        </p>
        <p>We’d love to hear from you!</p>
      </div>
    </>
  );
}

export default ContactUsPage;
