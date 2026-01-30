import { NextRequest, NextResponse } from "next/server";


//a basic server test route to debug shit later
export async function GET(req: NextRequest) {

    return NextResponse.json({
        message: "OK",
    }, {
        status: 200
    })

}