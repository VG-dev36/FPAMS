namespace FPAMS.Shared.Constants;

public static class Roles
{
    public const string SuperAdmin = "SUPER_ADMIN";
    public const string Principal = "PRINCIPAL";
    public const string HOD = "HOD";
    public const string Faculty = "FACULTY";
    public const string APEC = "APEC";

    public static readonly string[] All =
    {
        SuperAdmin,
        Principal,
        HOD,
        Faculty,
        APEC
    };
}