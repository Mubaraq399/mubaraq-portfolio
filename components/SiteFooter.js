export default function SiteFooter({ settings }) {
  const email = settings?.email || 'muhammadmubaraqelectricity@gmail.com';
  const linkedin = settings?.linkedin_url || 'https://www.linkedin.com/in/mubaraq-olalekan-03307b310/';
  const github = settings?.github_url || 'https://github.com/';

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-row">
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Mubaraq Olalekan</div>
            <div className="mute" style={{ fontSize: 13.5, marginTop: 4 }}>
              Electrical & Electronics Engineer
            </div>
            <div className="mute" style={{ fontSize: 13.5 }}>
              Embedded Systems · IoT · Electronics · PCB Design
            </div>
          </div>
          <div className="foot-links">
            <a href={linkedin}>LinkedIn</a>
            <a href={github}>GitHub</a>
            <a href={`mailto:${email}`}>Email</a>
          </div>
        </div>
        <div className="foot-bottom">© 2026 Mubaraq Olalekan. All rights reserved.</div>
      </div>
    </footer>
  );
}
