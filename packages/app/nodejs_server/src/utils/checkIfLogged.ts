export default (req: any): boolean => req.session?.userID != null;
