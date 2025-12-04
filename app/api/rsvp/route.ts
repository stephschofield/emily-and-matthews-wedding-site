import { NextResponse } from "next/server"
import { createServerClient, createAdminClient, updatePartyRSVPs } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { partyId, rsvps, email } = body

    if (!partyId || !rsvps || !Array.isArray(rsvps)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected partyId and rsvps array." },
        { status: 400 },
      )
    }

    // Update all RSVPs for the party using the RPC function
    await updatePartyRSVPs(partyId, rsvps)

    // Send confirmation email if email is provided
    if (email) {
      console.log("Attempting to send email...");
      console.log("FROM:", process.env.EMAIL_FROM);
      console.log("TO:", email);
      console.log("API Key starts with:", process.env.RESEND_API_KEY?.substring(0, 5));

      try {
        const attendingMembers = rsvps.filter((r: any) => r.status === "yes")
        const decliningMembers = rsvps.filter((r: any) => r.status === "no")
        
        // Helper to get name - we need to find the name from the rsvps array or fetch it if not present
        // The frontend sends member_id, status, meal_choice, allergies, notes.
        // It does NOT send full_name in the rsvps array for existing members, only for plus ones in update-names route.
        // We use the Admin Client here to bypass RLS policies so we can fetch names for the email
        // regardless of the current user's session state.
        const supabase = createAdminClient()
        const { data: partyMembers } = await supabase
          .from('party_members')
          .select('id, full_name')
          .eq('party_id', partyId)
          
        const getName = (id: string) => {
            const member = partyMembers?.find((m: any) => m.id === id)
            return member ? member.full_name : 'Guest'
        }

        const message = rsvps[0]?.notes;

        // Colors from tailwind config
        const colors = {
          sage: '#7D9D8C',
          cream: '#F9F6F0',
          navy: '#1A3A5F',
          gold: '#D4B572',
          white: '#FFFFFF',
          text: '#1A3A5F', // Using navy for text
          muted: '#64748b'
        };

        // Using a public placeholder image for now so it shows up in emails.
        // TODO: Replace with your actual deployed image URL: https://www.emandmatthew.com/images/rsvp-header.jpg
        const headerImageUrl = "https://www.emandmatthew.com/images/couple-foreheads.jpeg";

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap" rel="stylesheet">
              <style>
                body { margin: 0; padding: 0; background-color: ${colors.cream}; font-family: sans-serif; }
                .font-cormorant { font-family: 'Cormorant Garamond', serif; letter-spacing: 0.02em; }
              </style>
            </head>
            <body style="background-color: ${colors.cream}; margin: 0; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                
                <!-- Header Image -->
                <div style="width: 100%; height: 300px; background-color: ${colors.sage}; overflow: hidden;">
                  <img src="${headerImageUrl}" alt="Emily & Matthew" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px; text-align: center;">
                  <h1 style="font-family: 'Cormorant Garamond', serif; color: ${colors.navy}; margin: 0 0 10px 0; font-size: 32px; font-weight: 500;">RSVP Confirmation</h1>
                  <p style="color: ${colors.muted}; margin: 0 0 30px 0; font-size: 16px;">Thank you for responding to our wedding invitation</p>
                  
                  <div style="background-color: ${colors.cream}; padding: 30px; border-radius: 8px; text-align: left;">
                    ${rsvps.map((r: any) => {
                      const name = getName(r.member_id);
                      const isAttending = r.status === 'yes';
                      
                      return `
                        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(125, 157, 140, 0.2); last-child: border-bottom: none;">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <strong style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: ${colors.navy};">${name}</strong>
                            <span style="font-size: 12px; padding: 6px 12px; border-radius: 20px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; background-color: ${isAttending ? colors.sage : '#e2e8f0'}; color: ${isAttending ? colors.white : colors.muted};">
                              ${isAttending ? 'Attending' : 'Declining'}
                            </span>
                          </div>
                          ${isAttending ? `
                            <div style="font-size: 15px; color: ${colors.text}; line-height: 1.5;">
                              <div style="margin-bottom: 4px;"><span style="color: ${colors.muted};">Meal:</span> <strong>${r.meal_choice ? r.meal_choice.charAt(0).toUpperCase() + r.meal_choice.slice(1) : 'Not specified'}</strong></div>
                              ${r.allergies ? `<div><span style="color: ${colors.muted};">Dietary Restrictions:</span> ${r.allergies}</div>` : ''}
                            </div>
                          ` : ''}
                        </div>
                      `;
                    }).join('')}
                    
                    ${message ? `
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed ${colors.sage};">
                        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${colors.sage}; font-weight: 600;">Your Message</p>
                        <p style="margin: 0; font-style: italic; color: ${colors.navy}; font-family: 'Cormorant Garamond', serif; font-size: 18px;">"${message}"</p>
                      </div>
                    ` : ''}

                    <!-- Guest Checklist -->
                    <div style="margin-top: 30px; padding: 25px; background-color: rgba(125, 157, 140, 0.1); border-radius: 8px; border: 1px solid rgba(125, 157, 140, 0.3);">
                      <h3 style="font-family: 'Cormorant Garamond', serif; color: ${colors.navy}; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Guest Checklist</h3>
                      <ul style="margin: 0; padding-left: 20px; color: ${colors.text}; text-align: left; font-size: 15px; line-height: 1.6;">
                        <li style="margin-bottom: 10px;"><strong>The Big Day:</strong> Saturday, May 9, 2026</li>
                        <li style="margin-bottom: 10px;"><strong>Ceremony:</strong> Please arrive at the State Capitol Building by 6:00 PM</li>
                        <li style="margin-bottom: 10px;"><strong>Accommodation:</strong> Don't forget to <a href="https://book.passkey.com/go/BuecheAdamsWedding" style="color: ${colors.sage}; text-decoration: underline;">book your stay at the Hilton Capitol</a> (our shared hotel block)</li>
                        <li style="margin-bottom: 10px;"><strong>Music:</strong> Have a song request? <a href="https://www.emandmatthew.com/#playlist" style="color: ${colors.sage}; text-decoration: underline;">Add it to our playlist</a></li>
                        <li>Visit the website for full schedule and details</li>
                      </ul>
                    </div>
                  </div>

                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; color: ${colors.muted}; font-size: 14px; line-height: 1.6;">
                    <p style="margin-bottom: 10px;">
                      If you need to make any changes to your response, please simply resubmit your RSVP on the website.
                    </p>
                    <p style="font-family: 'Cormorant Garamond', serif; font-size: 20px; color: ${colors.sage}; margin-top: 20px;">
                      With love,<br/>Emily & Matthew
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `

        const primaryName = rsvps.length > 0 ? getName(rsvps[0].member_id) : 'Guest';

        // Default to the verified domain if env var is missing, rather than the testing domain
        const fromAddress = process.env.EMAIL_FROM || 'rsvp@emandmatthew.com';

        const { error } = await resend.emails.send({
          from: fromAddress,
          to: email,
          subject: `RSVP Confirmation - ${primaryName}`,
          html: emailHtml,
        })

        if (error) {
          console.error("Resend API Error:", error)
        } else {
          console.log(`Confirmation email sent to ${email}`)
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
        // We don't fail the request if email fails, as the RSVP was saved
      }
    }

    return NextResponse.json({
      success: true,
      message: "RSVP saved successfully",
      updated: rsvps.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to save RSVP", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    // Query all parties with their members and RSVP status
    const { data: parties, error } = await supabase.from("parties").select(`
        id,
        household_label,
        party_members (
          id,
          full_name,
          is_plus_one_placeholder,
          allow_attend,
          sort_order,
          rsvps (
            status,
            meal_choice,
            allergies,
            notes,
            updated_at
          )
        )
      `)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch RSVPs", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ parties })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
