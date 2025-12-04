"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, XCircle } from "lucide-react"
import { PartyResult } from "./rsvp-search"

interface PartyConfirmProps {
  party: PartyResult
  onConfirm: () => void
  onReject: () => void
}

export function PartyConfirm({ party, onConfirm, onReject }: PartyConfirmProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
      <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
        <div className="flex items-center justify-center mb-3">
          <Users className="w-8 h-8 text-sage mr-3" />
        </div>
        <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
          Confirm Your Invitation
        </h2>
        <p className="text-slate-600 mt-2 font-light">
          Please verify this is your party
        </p>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          {/* Household Name */}
          <div className="text-center">
            <h3 className="text-2xl font-cormorant text-navy mb-6 font-medium">
              {party.household_label}
            </h3>
            <div className="w-16 h-px bg-sage/40 mx-auto mb-6"></div>
          </div>

          {/* Party Members List */}
          <Card className="border-sage/20 bg-sage/5">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-4 text-center font-light">
                This invitation includes:
              </p>
              <div className="space-y-3">
                {party.members.map((member, index) => (
                  <div
                    key={member.member_id}
                    className="flex items-center justify-center py-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-sage mr-3" />
                    <span className="text-lg font-cormorant text-slate-800">
                      {member.is_plus_one_placeholder ? (
                        <span className="italic text-slate-600">Guest of {party.members[0]?.full_name}</span>
                      ) : (
                        member.full_name
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Message */}
          <div className="bg-sky-blue/10 border border-sky-blue/20 rounded-lg p-6">
            <p className="text-center text-slate-700 leading-relaxed">
              <strong>Important:</strong> Please confirm this is your party before continuing. 
              You will not be able to add or remove guests from this list.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={onReject}
              variant="outline"
              className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant text-lg font-light tracking-wide flex items-center gap-2"
            >
              <XCircle className="h-5 w-5" />
              No, this is not us
            </Button>

            <Button
              onClick={onConfirm}
              className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant text-lg font-light tracking-wide flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              Yes, this is us
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-slate-500 text-center pt-4">
            Not your party? Contact us at{" "}
            <a href="mailto:eebueche@gmail.com" className="text-sage hover:text-sage/80 underline">
              eebueche@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
