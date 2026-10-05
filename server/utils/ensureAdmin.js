const User = require("../models/User")

const ensureAdmin = async () => {
    try {
        const adminEmail =
            process.env.ADMIN_EMAIL?.trim().toLowerCase()

        const adminPassword =
            process.env.ADMIN_PASSWORD

        const adminName =
            process.env.ADMIN_NAME?.trim()

        if (
            !adminEmail ||
            !adminPassword ||
            !adminName
        ) {
            console.log(
                "Admin environment variables are not configured."
            )

            return
        }

        let adminUser =
            await User.findOne({
                email: adminEmail,
            })

        if (!adminUser) {
            adminUser = new User({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: "Admin",
            })

            await adminUser.save()

            console.log(
                `Admin account created: ${adminEmail}`
            )

            return
        }

        let changed = false

        if (adminUser.name !== adminName) {
            adminUser.name = adminName
            changed = true
        }

        if (adminUser.role !== "Admin") {
            adminUser.role = "Admin"
            changed = true
        }

        if (adminUser.password) {
            const bcrypt = require("bcryptjs")

            const passwordMatches =
                await bcrypt.compare(
                    adminPassword,
                    adminUser.password
                )

            if (!passwordMatches) {
                adminUser.password =
                    adminPassword

                changed = true
            }
        }

        if (changed) {
            await adminUser.save()

            console.log(
                `Admin account updated: ${adminEmail}`
            )
        } else {
            console.log(
                `Admin account ready: ${adminEmail}`
            )
        }
    } catch (error) {
        console.error(
            "Ensure admin error:",
            error
        )
    }
}

module.exports = ensureAdmin