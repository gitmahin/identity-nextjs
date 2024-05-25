import {
    Html,
    Head,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Link
} from "@react-email/components"

interface verificationEmailProps {
    username: string;
    email: string;
    verifyCode: string
}


export default function verificationEmail({username, email, verifyCode}: verificationEmailProps){
    return(
        <Html>
            <Head>
                <title>Verification code</title>
            </Head>
            <Preview>Here&apos;s is your verification code {verifyCode}</Preview>
            <Section>
                <Row>
                    <Heading>Hello {email}</Heading>
                </Row>
                <Row>
                <Heading>Your Verification code: {verifyCode}</Heading>
                </Row>
                <Row>
                    <Text>
                        Go to the link <Link href={`http://localhost:3000/verify-email/${username}`}>http://localhost:3000/verify-email/{username}</Link> and paste the code
                    </Text>
                </Row>
            </Section>

        </Html>
    )
}