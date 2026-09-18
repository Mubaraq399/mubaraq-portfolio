import { createClient } from '@/lib/supabaseServer';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

const SKILL_CATEGORY_ORDER = [
  'Embedded Systems',
  'Programming & Firmware',
  'IoT & Connectivity',
  'Electronics',
  'PCB Design',
  'Test & Workshop Tools'
];

async function getData() {
  const supabase = createClient();

  const [{ data: projects }, { data: skills }, { data: experience }, { data: education }, { data: settingsRow }] =
    await Promise.all([
      supabase.from('projects').select('*').eq('status', 'published').order('project_date', { ascending: false }),
      supabase.from('skills').select('*').order('order_index', { ascending: true }),
      supabase.from('experience').select('*').order('order_index', { ascending: true }),
      supabase.from('education').select('*').order('order_index', { ascending: true }),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle()
    ]);

  const skillsByCategory = {};
  (skills || []).forEach((s) => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s.name);
  });

  return {
    projects: projects || [],
    skillsByCategory,
    experience: experience || [],
    education: education || [],
    settings: settingsRow || {}
  };
}

export default async function HomePage() {
  const { projects, skillsByCategory, experience, education, settings } = await getData();

  const categories = [
    ...SKILL_CATEGORY_ORDER.filter((c) => skillsByCategory[c]),
    ...Object.keys(skillsByCategory).filter((c) => !SKILL_CATEGORY_ORDER.includes(c))
  ];

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div>
            <div className="status-pill">
              <span className="status-dot"></span> {settings.status_message || 'Open to Engineering Opportunities'}
            </div>
            <div className="tag">ELECTRICAL &amp; ELECTRONICS ENGINEER</div>
            <h1 className="h-xl">
              Building Embedded &amp; IoT Systems That Connect Hardware With the Real World.
            </h1>
            <p className="hero-sub">
              Electrical &amp; Electronics Engineering graduate with hands-on experience designing, building,
              testing, and troubleshooting embedded hardware and IoT systems using ESP32, Arduino, ATmega328P,
              sensors, actuators, cloud platforms, and custom PCBs.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                Explore My Projects
              </a>
              <a href={settings.cv_url || '[INSERT CV FILE/LINK]'} className="btn btn-ghost" download>
                Download CV
              </a>
            </div>
            <div className="hero-badges">
              <span className="badge">ESP32</span>
              <span className="badge">Arduino</span>
              <span className="badge">ATmega328P</span>
              <span className="badge">PCB Design</span>
              <span className="badge">IoT</span>
              <span className="badge">Firebase</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="150" y="140" width="180" height="140" rx="8" fill="var(--surface)" stroke="var(--border-strong)" />
              <rect x="168" y="158" width="60" height="60" rx="3" fill="var(--surface-2)" stroke="var(--copper)" strokeWidth="1.3" />
              <text x="176" y="192" fontFamily="var(--font-mono)" fontSize="9" fill="var(--copper)">ESP32</text>
              <g stroke="var(--border-strong)" strokeWidth="1">
                <line x1="150" y1="160" x2="140" y2="160" /><line x1="150" y1="175" x2="140" y2="175" />
                <line x1="150" y1="190" x2="140" y2="190" /><line x1="150" y1="205" x2="140" y2="205" />
                <line x1="330" y1="160" x2="340" y2="160" /><line x1="330" y1="175" x2="340" y2="175" />
                <line x1="330" y1="190" x2="340" y2="190" /><line x1="330" y1="205" x2="340" y2="205" />
              </g>
              <circle cx="255" cy="200" r="9" fill="none" stroke="var(--teal)" strokeWidth="1.3" />
              <circle cx="255" cy="200" r="3" fill="var(--teal)" />
              <rect x="240" y="230" width="70" height="18" rx="3" fill="none" stroke="var(--border-strong)" />
              <path className="trace-line" d="M240 140 L240 90 L120 90 L120 50" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" />
              <path className="trace-line d2" d="M280 280 L280 330 L370 330 L370 370" stroke="var(--teal)" strokeWidth="1.4" strokeLinecap="round" />
              <path className="trace-line d3" d="M150 220 L90 220 L90 300" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" />
              <g className="node-pulse">
                <circle cx="120" cy="42" r="5" fill="var(--copper)" />
                <text x="90" y="26" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-mute)">SENSOR NODE</text>
              </g>
              <g className="node-pulse" style={{ animationDelay: '.9s' }}>
                <circle cx="370" cy="378" r="5" fill="var(--teal)" />
                <text x="330" y="400" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-mute)">CLOUD SYNC</text>
              </g>
              <g className="node-pulse" style={{ animationDelay: '1.6s' }}>
                <circle cx="90" cy="308" r="5" fill="var(--copper)" />
                <text x="20" y="330" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-mute)">ACTUATOR</text>
              </g>
              <rect x="150" y="140" width="180" height="140" rx="8" fill="none" stroke="var(--border)" />
            </svg>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="wrap about-grid">
          <div className="about-text">
            <div className="tag">ABOUT ME</div>
            <h2 className="h-l">Engineering Ideas Into Working Hardware</h2>
            <p>
              Electrical &amp; Electronics Engineering graduate with hands-on experience designing, building,
              testing, and troubleshooting embedded and IoT-based electronic systems. My practical work spans
              microcontroller programming, sensor integration, circuit design, PCB fabrication, IoT connectivity,
              actuator control, and electronics repair.
            </p>
            <p>
              I enjoy turning real-world problems into practical electronic solutions, from automated monitoring
              systems to smart control systems and custom embedded hardware.
            </p>
          </div>
          <div className="stat-card">
            <div className="stat">
              <div className="stat-num">{projects.length > 0 ? `${projects.length}+` : '6+'}</div>
              <div className="stat-label">Embedded &amp; IoT Projects</div>
            </div>
            <div className="stat">
              <div className="stat-num">ESP32</div>
              <div className="stat-label">IoT Development</div>
            </div>
            <div className="stat">
              <div className="stat-num">ATmega328P</div>
              <div className="stat-label">Microcontroller Systems</div>
            </div>
            <div className="stat">
              <div className="stat-num">PCB</div>
              <div className="stat-label">Design &amp; Fabrication</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ background: 'var(--bg-alt)' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="tag">SELECTED WORK</div>
            <h2 className="h-l">Projects I&apos;ve Built</h2>
            <p className="sub mute" style={{ marginTop: 14, fontSize: 15.5 }}>
              A selection of embedded, IoT, electronics, and automation systems developed through practical
              engineering work.
            </p>
          </div>
          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No published projects yet — add one from <code>/admin/projects/new</code>.
            </div>
          )}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="wrap">
          <div className="section-head">
            <div className="tag">TECHNICAL SKILLS</div>
            <h2 className="h-l">Tools &amp; Technologies</h2>
          </div>
          {categories.length > 0 ? (
            <div className="skills-grid">
              {categories.map((cat) => (
                <div className="skill-card" key={cat}>
                  <h3>{cat}</h3>
                  <ul className="skill-list">
                    {skillsByCategory[cat].map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No skills added yet — manage them from <code>/admin/skills</code>.
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCE + EDUCATION */}
      <section id="experience" style={{ background: 'var(--bg-alt)' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="tag">EXPERIENCE</div>
            <h2 className="h-l">Where I&apos;ve Worked</h2>
          </div>
          {experience.length > 0 ? (
            <div className="timeline">
              {experience.map((e) => (
                <div className="t-item" key={e.id}>
                  <div className="t-meta">{e.period}</div>
                  <h3>{e.role}</h3>
                  <div className="t-org">{e.organization}</div>
                  <p>{e.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No experience entries yet — add them from <code>/admin/experience</code>.
            </div>
          )}

          {education.length > 0 && (
            <div className="edu-grid">
              {education.map((ed) => (
                <div className="edu-card" key={ed.id}>
                  <div className="deg">{ed.degree}</div>
                  <div className="inst">
                    {ed.institution}
                    {ed.period ? ` · ${ed.period}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW I BUILD */}
      <section id="workflow">
        <div className="wrap">
          <div className="section-head">
            <div className="tag">PROCESS</div>
            <h2 className="h-l">How I Build</h2>
          </div>
          <div className="workflow">
            <div className="wf-line" aria-hidden="true"></div>
            <div className="wf-row">
              <div className="wf-step"><div className="wf-num">01</div><h3>Understand</h3><p>Identify the problem and requirements.</p></div>
              <div className="wf-step"><div className="wf-num">02</div><h3>Design</h3><p>Develop the circuit, architecture, and system concept.</p></div>
              <div className="wf-step"><div className="wf-num">03</div><h3>Build</h3><p>Assemble hardware, PCB, sensors, and actuators.</p></div>
              <div className="wf-step"><div className="wf-num">04</div><h3>Program</h3><p>Develop and integrate embedded firmware and IoT functionality.</p></div>
              <div className="wf-step"><div className="wf-num">05</div><h3>Test &amp; Improve</h3><p>Test the system, troubleshoot faults, and refine the design.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* GITHUB */}
      <section id="github" style={{ background: 'var(--bg-alt)' }}>
        <div className="wrap">
          <div className="cta-panel">
            <div>
              <div className="tag">TECHNICAL WORK</div>
              <h2>Explore the Code Behind My Projects</h2>
              <p>Project repositories contain firmware, schematics, documentation, PCB files, and supporting resources where available.</p>
            </div>
            <a href={settings.github_url || 'https://github.com/'} className="btn btn-primary" target="_blank" rel="noreferrer">
              Visit GitHub
            </a>
          </div>
        </div>
      </section>

      {/* CV */}
      <section id="cv">
        <div className="wrap">
          <div className="cta-panel">
            <div>
              <h2>Want to know more about my engineering experience?</h2>
              <p>Download my CV to explore my education, engineering experience, technical skills, and project work.</p>
            </div>
            <a href={settings.cv_url || '[INSERT CV FILE/LINK]'} className="btn btn-primary" download>
              Download CV
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: 'var(--bg-alt)' }}>
        <div className="wrap contact-grid">
          <div>
            <div className="tag">CONTACT</div>
            <h2 className="h-l">Let&apos;s Build Something</h2>
            <p className="mute" style={{ marginTop: 16, fontSize: 15.5 }}>
              Interested in embedded systems, IoT, electronics, automation, or engineering opportunities? Let&apos;s
              connect.
            </p>
            <div className="contact-links">
              <a className="contact-link" href={`mailto:${settings.email || 'muhammadmubaraqelectricity@gmail.com'}`}>
                <span><span className="k">EMAIL</span>{settings.email || 'muhammadmubaraqelectricity@gmail.com'}</span>
              </a>
              <a className="contact-link" href={settings.linkedin_url || 'https://www.linkedin.com/in/mubaraq-olalekan-03307b310/'} target="_blank" rel="noreferrer">
                <span><span className="k">LINKEDIN</span>{settings.linkedin_url || 'https://www.linkedin.com/in/mubaraq-olalekan-03307b310/'}</span>
              </a>
              <a className="contact-link" href={settings.github_url || 'https://github.com/'} target="_blank" rel="noreferrer">
                <span><span className="k">GITHUB</span>{settings.github_url || 'https://github.com/'}</span>
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <SiteFooter settings={settings} />
    </>
  );
}
