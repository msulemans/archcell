# Archcell website audit — 13 September 2026

Audited the local site on port 5500 in Safari, including all nine HTML pages, project details, drawing catalogue/viewer, enquiry steps, filters, accordions and photography credits. Desktop, 768px tablet and 390px mobile states were captured. This is a design and usability audit with targeted code checks, not a security audit or accessibility certification.

## Findings and fixes

| Finding | Change | Evidence |
| --- | --- | --- |
| Drawing viewer opened at full width, cutting off the bottom of the sheet. | Fit now considers both available width and height, recalculates on resize, and resets scrolling. The control says “Fit”. | [Before](screenshots/07-viewer-before.png) |
| At 768px the desktop navigation and brand wrapped, and the project CTA disappeared. | Navigation switches to a menu at 1100px; tablet widths retain the project CTA. | [Before](screenshots/19-tablet-before.png) |
| Navigation, photo labels and gold eyebrow text lost contrast over bright images. | Stronger photo overlays, solid caption backing, light hero labels, and darker gold on light surfaces. | [Home](screenshots/01-home-before.png), [project](screenshots/05-project-story-before.png), [mobile](screenshots/17-mobile-home-before.png) |
| Open mobile menu still said “Open navigation”; the accessibility tree included the underlying page. | Label changes to “Close navigation”; background becomes inert; focus stays within menu controls; Escape restores button focus; resizing clears the menu. | [Before](screenshots/18-mobile-menu-before.png), captured accessibility tree |
| No skip link; inconsistent keyboard focus for controls and accordions. | Added a skip link and shared focus style, with a darker focus color on light sections. | Source and page accessibility trees |
| Project utility links could return to the collection instead of home; “Back to top” left the project. | Corrected home/collection links; back-to-top keeps the current project open. | Project link destinations in the captured accessibility tree |
| Unknown project links silently showed the underlying page. | Added an explicit project-not-found state with a recovery link. | Router inspection |
| Catalogue navigation combined two scroll offsets, leaving an unnecessary band above the section. | A single measured offset aligns the catalogue below its sticky navigation. Active section and focus now follow the story/drawings route. | [Before](screenshots/06-catalogue-before.png) |
| The mobile contact layout placed a long block of placeholder contact information before the form. | Form now comes first below the heading on mobile/tablet; “Write your brief” jumps directly to it. | Contact markup and responsive layout rules |
| Enquiry errors were generic and step transitions focused an input without exposing the new step clearly. | Specific validation messages, invalid-field outlines, focus on step legends, current-step semantics, explicit minimum message length, and a visible demo notice. | [Validation before](screenshots/12-contact-before.png) |
| Image-pair captions used a dark-surface text color on light paper; some light-section dividers/focus were faint. | Corrected caption and focus colors; increased footer spacing. | CSS inspection |
| Narrow archive rows and long project headings could squeeze their content. | Flexible archive columns, smaller thumbnails, wrapping headings and larger viewer touch targets. | [Archive](screenshots/11-drawing-room-before.png), responsive rules |
| Generator accumulated whitespace across rebuilds. | Normalized shared-footer replacement; repeated builds now produce identical files. | Build checksum comparison |

## Page and flow coverage

1. **Homepage — improved.** Inspected hero, introduction, project collection and mobile menu. [Hero](screenshots/01-home-before.png) · [Sections](screenshots/02-home-sections-before.png)
2. **Selected work — functioning.** Filters correctly switched from six projects to the single interior project. Opened its detail page. [Collection](screenshots/03-projects-before.png) · [Filter](screenshots/04-filter-before.png)
3. **Project story and drawings — fixes applied.** Inspected detail navigation, catalogue and drawing dialog. Corrected fit, route handling, focus and active navigation. [Story](screenshots/05-project-story-before.png) · [Catalogue](screenshots/06-catalogue-before.png) · [Viewer](screenshots/07-viewer-before.png)
4. **Studio — healthy layout; content needs owner verification.** Inspected page and shared components. Claims about experience and project counts are not verified by this audit. [Studio](screenshots/08-studio-before.png)
5. **Services — functioning.** Expanded the interior scope and checked service-specific contact link targets. Architecture preselection was confirmed on the contact page. [Services](screenshots/09-services-before.png)
6. **Process — functioning.** Read the process and expanded the first FAQ. [FAQ](screenshots/10-process-before.png)
7. **Drawing room — functioning.** Inspected the six archive rows and their project drawing destinations. [Archive](screenshots/11-drawing-room-before.png)
8. **Contact — functioning preview, improved mobile access.** Exercised required-field validation, service preselection, sample population, both steps and local summary generation. No enquiry was sent. [Validation](screenshots/12-contact-before.png) · [Summary](screenshots/13-enquiry-result-before.png)
9. **About this preview and credits — functioning.** Read disclosures and opened/closed photography credits. [Information](screenshots/14-preview-info-before.png) · [Credits](screenshots/15-credits-before.png)
10. **404 — functioning recovery page.** Inspected the explicit `/404.html` page and recovery destinations. [404](screenshots/16-not-found-before.png)

## Still needed before a real launch

- Replace placeholder email, phone and address with confirmed studio details.
- Connect the enquiry to an agreed delivery service and test actual delivery, failure handling and spam protection. It currently prepares a downloadable brief only.
- Replace or approve illustrative projects, reference photographs and sample drawings. Verify the studio’s experience/project-count claims.
- Confirm the final domain and update the canonical origin in `build-pages.mjs` if needed.
- Configure the deployment host to serve `404.html` for unknown paths. Python’s basic local server does not do that automatically.
- Update the preview/privacy copy for the actual hosting and enquiry setup. Current copy describes the original Sites deployment.

## Verification and limits

- Build succeeded. JavaScript syntax checks passed.
- All nine generated pages have one page heading, one skip link, no duplicate IDs and alt attributes on images.
- All 280 static local links/assets and their applicable fragment targets resolve.
- Repeated builds produce identical HTML. `git diff --check` passed.
- Existing interactive flows were exercised through Safari. Final visual checks are recorded separately below as completed.
- No live form delivery, physical mobile device test, screen-reader session, exhaustive browser matrix, performance benchmark or external-source/claim verification was performed.
- SVG and brief download handlers were inspected; downloaded files were not opened during the initial audit.

Screenshots show the states captured during this audit, before fixes unless explicitly named otherwise. Source files and regenerated pages are modified locally; no commit or deployment was made.
