import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  let ADMIN_PASSWORD = "Apexdigital5456";
  let SESSION_TTL_NS : Int = 43_200_000_000_000; // 12 hours

  type Contact = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type LeadNote = {
    id : Text;
    body : Text;
    createdAt : Int;
  };

  type ProjectSubmission = {
    projectId : Text;
    package_ : Text;
    clientName : Text;
    email : Text;
    businessName : Text;
    currentWebsite : Text;
    businessType : Text;
    whatTheyNeed : Text;
    projectDescription : Text;
    numberOfPages : Text;
    needsContactForm : Bool;
    needsBooking : Bool;
    needsPaymentIntegration : Bool;
    needsDashboard : Bool;
    needsContentWriting : Bool;
    needsBranding : Bool;
    inspirationLinks : Text;
    timeline : Text;
    contentReadiness : Text;
    additionalNotes : Text;
    paymentStatus : Text;
    transactionHash : Text;
    crmStatus : Text;
    priority : Text;
    quoteStatus : Text;
    quoteAmount : Text;
    quoteSummary : Text;
    quoteToken : ?Text;
    quoteExpiresAt : ?Int;
    followUpAt : ?Int;
    internalNotes : [LeadNote];
    timestamp : Int;
    lastUpdated : Int;
  };

  type PublicQuote = {
    projectId : Text;
    clientName : Text;
    businessName : Text;
    package_ : Text;
    quoteAmount : Text;
    quoteSummary : Text;
    quoteStatus : Text;
    quoteExpiresAt : ?Int;
  };

  type AdminStats = {
    totalProjects : Nat;
    totalContacts : Nat;
    paidProjects : Nat;
    pendingProjects : Nat;
    followUpsDue : Nat;
  };

  type AdminDashboard = {
    projects : [ProjectSubmission];
    contacts : [Contact];
    stats : AdminStats;
  };

  type AdminSession = {
    token : Text;
    expiresAt : Int;
  };

  var contacts : [Contact] = [];
  var projects : [ProjectSubmission] = [];
  var sessions : [AdminSession] = [];

  var projectCounter : Nat = 0;
  var sessionCounter : Nat = 0;
  var noteCounter : Nat = 0;
  var quoteCounter : Nat = 0;

  func prepend<T>(items : [T], item : T) : [T] {
    Array.tabulate<T>(
      items.size() + 1,
      func(index : Nat) : T {
        if (index == 0) {
          item;
        } else {
          items[index - 1];
        };
      },
    );
  };

  func append<T>(items : [T], item : T) : [T] {
    Array.tabulate<T>(
      items.size() + 1,
      func(index : Nat) : T {
        if (index < items.size()) {
          items[index];
        } else {
          item;
        };
      },
    );
  };

  func isWinningStatus(status : Text) : Bool {
    status == "won" or status == "lost";
  };

  func upsertSession(token : Text, expiresAt : Int) {
    var found = false;
    sessions := Array.tabulate<AdminSession>(
      sessions.size(),
      func(index : Nat) : AdminSession {
        let session = sessions[index];
        if (session.token == token) {
          found := true;
          { token; expiresAt };
        } else {
          session;
        };
      },
    );
    if (not found) {
      sessions := prepend<AdminSession>(sessions, { token; expiresAt });
    };
  };

  func findSession(token : Text) : ?AdminSession {
    for (session in sessions.values()) {
      if (session.token == token) {
        return ?session;
      };
    };
    null;
  };

  func isValidSession(token : Text) : Bool {
    switch (findSession(token)) {
      case null { false };
      case (?session) { session.expiresAt > Time.now() };
    };
  };

  func requireAdminSession(token : Text) {
    if (not isValidSession(token)) {
      assert false;
    };
  };

  func replaceProject(updated : ProjectSubmission) : Bool {
    var found = false;
    projects := Array.tabulate<ProjectSubmission>(
      projects.size(),
      func(index : Nat) : ProjectSubmission {
        let project = projects[index];
        if (project.projectId == updated.projectId) {
          found := true;
          updated;
        } else {
          project;
        };
      },
    );
    found;
  };

  func findProject(projectId : Text) : ?ProjectSubmission {
    for (project in projects.values()) {
      if (project.projectId == projectId) {
        return ?project;
      };
    };
    null;
  };

  func removeProjects(projectId : Text) : Bool {
    let originalSize = projects.size();
    projects := projects.filter(
      func(project : ProjectSubmission) : Bool {
        project.projectId != projectId;
      },
    );
    originalSize != projects.size();
  };

  func removeContacts(timestamp : Int) : Bool {
    let originalSize = contacts.size();
    contacts := contacts.filter(
      func(contact : Contact) : Bool {
        contact.timestamp != timestamp;
      },
    );
    originalSize != contacts.size();
  };

  func makeLeadNote(body : Text) : LeadNote {
    noteCounter += 1;
    {
      id = "NOTE-" # noteCounter.toText();
      body;
      createdAt = Time.now();
    };
  };

  func makeQuoteToken(projectId : Text) : Text {
    quoteCounter += 1;
    "quote-" # projectId # "-" # quoteCounter.toText() # "-" # Time.now().toText();
  };

  func buildStats() : AdminStats {
    var paidProjects : Nat = 0;
    var pendingProjects : Nat = 0;
    var followUpsDue : Nat = 0;
    let now = Time.now();

    for (project in projects.values()) {
      if (project.paymentStatus == "paid") {
        paidProjects += 1;
      } else {
        pendingProjects += 1;
      };

      switch (project.followUpAt) {
        case null {};
        case (?followUpAt) {
          if (followUpAt <= now and not isWinningStatus(project.crmStatus)) {
            followUpsDue += 1;
          };
        };
      };
    };

    {
      totalProjects = projects.size();
      totalContacts = contacts.size();
      paidProjects;
      pendingProjects;
      followUpsDue;
    };
  };

  public shared func submitContact(name : Text, email : Text, message : Text) : async () {
    contacts := prepend<Contact>(
      contacts,
      {
        name;
        email;
        message;
        timestamp = Time.now();
      },
    );
  };

  public shared func submitProject(
    package_ : Text,
    clientName : Text,
    email : Text,
    businessName : Text,
    currentWebsite : Text,
    businessType : Text,
    whatTheyNeed : Text,
    projectDescription : Text,
    numberOfPages : Text,
    needsContactForm : Bool,
    needsBooking : Bool,
    needsPaymentIntegration : Bool,
    needsDashboard : Bool,
    needsContentWriting : Bool,
    needsBranding : Bool,
    inspirationLinks : Text,
    timeline : Text,
    contentReadiness : Text,
    additionalNotes : Text,
  ) : async Text {
    projectCounter += 1;
    let now = Time.now();
    let projectId = "APEX-" # projectCounter.toText();
    let submission : ProjectSubmission = {
      projectId;
      package_;
      clientName;
      email;
      businessName;
      currentWebsite;
      businessType;
      whatTheyNeed;
      projectDescription;
      numberOfPages;
      needsContactForm;
      needsBooking;
      needsPaymentIntegration;
      needsDashboard;
      needsContentWriting;
      needsBranding;
      inspirationLinks;
      timeline;
      contentReadiness;
      additionalNotes;
      paymentStatus = "pending";
      transactionHash = "";
      crmStatus = "new";
      priority = "medium";
      quoteStatus = "draft";
      quoteAmount = "";
      quoteSummary = "";
      quoteToken = null;
      quoteExpiresAt = null;
      followUpAt = null;
      internalNotes = [];
      timestamp = now;
      lastUpdated = now;
    };
    projects := prepend<ProjectSubmission>(projects, submission);
    projectId;
  };

  public shared func updatePaymentStatus(projectId : Text, status : Text, txHash : Text) : async Bool {
    switch (findProject(projectId)) {
      case null { false };
      case (?existing) {
        replaceProject({
          projectId = existing.projectId;
          package_ = existing.package_;
          clientName = existing.clientName;
          email = existing.email;
          businessName = existing.businessName;
          currentWebsite = existing.currentWebsite;
          businessType = existing.businessType;
          whatTheyNeed = existing.whatTheyNeed;
          projectDescription = existing.projectDescription;
          numberOfPages = existing.numberOfPages;
          needsContactForm = existing.needsContactForm;
          needsBooking = existing.needsBooking;
          needsPaymentIntegration = existing.needsPaymentIntegration;
          needsDashboard = existing.needsDashboard;
          needsContentWriting = existing.needsContentWriting;
          needsBranding = existing.needsBranding;
          inspirationLinks = existing.inspirationLinks;
          timeline = existing.timeline;
          contentReadiness = existing.contentReadiness;
          additionalNotes = existing.additionalNotes;
          paymentStatus = status;
          transactionHash = txHash;
          crmStatus = existing.crmStatus;
          priority = existing.priority;
          quoteStatus = existing.quoteStatus;
          quoteAmount = existing.quoteAmount;
          quoteSummary = existing.quoteSummary;
          quoteToken = existing.quoteToken;
          quoteExpiresAt = existing.quoteExpiresAt;
          followUpAt = existing.followUpAt;
          internalNotes = existing.internalNotes;
          timestamp = existing.timestamp;
          lastUpdated = Time.now();
        });
      };
    };
  };

  public query func getContacts() : async [Contact] {
    contacts;
  };

  public query func getProjects() : async [ProjectSubmission] {
    projects;
  };

  public query func getPublicQuote(projectId : Text, quoteToken : Text) : async ?PublicQuote {
    switch (findProject(projectId)) {
      case null { null };
      case (?project) {
        switch (project.quoteToken) {
          case null { null };
          case (?storedToken) {
            if (storedToken != quoteToken or project.quoteStatus == "draft") {
              null;
            } else {
              ?{
                projectId = project.projectId;
                clientName = project.clientName;
                businessName = project.businessName;
                package_ = project.package_;
                quoteAmount = project.quoteAmount;
                quoteSummary = project.quoteSummary;
                quoteStatus = project.quoteStatus;
                quoteExpiresAt = project.quoteExpiresAt;
              };
            };
          };
        };
      };
    };
  };

  public shared func adminLogin(password : Text) : async ?Text {
    if (password != ADMIN_PASSWORD) {
      return null;
    };

    sessionCounter += 1;
    let token = "apex-admin-" # sessionCounter.toText() # "-" # Time.now().toText();
    upsertSession(token, Time.now() + SESSION_TTL_NS);
    ?token;
  };

  public shared func adminValidateSession(token : Text) : async Bool {
    isValidSession(token);
  };

  public shared func adminLogout(token : Text) : async () {
    upsertSession(token, 0);
  };

  public shared func adminGetDashboard(token : Text) : async AdminDashboard {
    requireAdminSession(token);
    {
      projects;
      contacts;
      stats = buildStats();
    };
  };

  public shared func adminUpdateProject(
    token : Text,
    projectId : Text,
    crmStatus : Text,
    priority : Text,
    followUpAt : ?Int,
    note : ?Text,
  ) : async Bool {
    requireAdminSession(token);
    switch (findProject(projectId)) {
      case null { false };
      case (?existing) {
        let nextNotes = switch (note) {
          case null { existing.internalNotes };
          case (?value) {
            if (value.trim(#char ' ') == "") {
              existing.internalNotes;
            } else {
              append(existing.internalNotes, makeLeadNote(value));
            };
          };
        };
        replaceProject({
          projectId = existing.projectId;
          package_ = existing.package_;
          clientName = existing.clientName;
          email = existing.email;
          businessName = existing.businessName;
          currentWebsite = existing.currentWebsite;
          businessType = existing.businessType;
          whatTheyNeed = existing.whatTheyNeed;
          projectDescription = existing.projectDescription;
          numberOfPages = existing.numberOfPages;
          needsContactForm = existing.needsContactForm;
          needsBooking = existing.needsBooking;
          needsPaymentIntegration = existing.needsPaymentIntegration;
          needsDashboard = existing.needsDashboard;
          needsContentWriting = existing.needsContentWriting;
          needsBranding = existing.needsBranding;
          inspirationLinks = existing.inspirationLinks;
          timeline = existing.timeline;
          contentReadiness = existing.contentReadiness;
          additionalNotes = existing.additionalNotes;
          paymentStatus = existing.paymentStatus;
          transactionHash = existing.transactionHash;
          crmStatus;
          priority;
          quoteStatus = existing.quoteStatus;
          quoteAmount = existing.quoteAmount;
          quoteSummary = existing.quoteSummary;
          quoteToken = existing.quoteToken;
          quoteExpiresAt = existing.quoteExpiresAt;
          followUpAt;
          internalNotes = nextNotes;
          timestamp = existing.timestamp;
          lastUpdated = Time.now();
        });
      };
    };
  };

  public shared func adminCreateQuote(
    token : Text,
    projectId : Text,
    quoteAmount : Text,
    quoteSummary : Text,
    quoteExpiresAt : ?Int,
  ) : async ?Text {
    requireAdminSession(token);
    switch (findProject(projectId)) {
      case null { null };
      case (?existing) {
        let nextToken = switch (existing.quoteToken) {
          case null { makeQuoteToken(projectId) };
          case (?stored) { stored };
        };
        let nextStatus =
          if (quoteAmount.trim(#char ' ') == "" or quoteSummary.trim(#char ' ') == "") {
            "draft";
          } else {
            "sent";
          };
        ignore replaceProject({
          projectId = existing.projectId;
          package_ = existing.package_;
          clientName = existing.clientName;
          email = existing.email;
          businessName = existing.businessName;
          currentWebsite = existing.currentWebsite;
          businessType = existing.businessType;
          whatTheyNeed = existing.whatTheyNeed;
          projectDescription = existing.projectDescription;
          numberOfPages = existing.numberOfPages;
          needsContactForm = existing.needsContactForm;
          needsBooking = existing.needsBooking;
          needsPaymentIntegration = existing.needsPaymentIntegration;
          needsDashboard = existing.needsDashboard;
          needsContentWriting = existing.needsContentWriting;
          needsBranding = existing.needsBranding;
          inspirationLinks = existing.inspirationLinks;
          timeline = existing.timeline;
          contentReadiness = existing.contentReadiness;
          additionalNotes = existing.additionalNotes;
          paymentStatus = existing.paymentStatus;
          transactionHash = existing.transactionHash;
          crmStatus = existing.crmStatus;
          priority = existing.priority;
          quoteStatus = nextStatus;
          quoteAmount;
          quoteSummary;
          quoteToken = ?nextToken;
          quoteExpiresAt;
          followUpAt = existing.followUpAt;
          internalNotes = existing.internalNotes;
          timestamp = existing.timestamp;
          lastUpdated = Time.now();
        });
        ?nextToken;
      };
    };
  };

  public shared func adminDeleteProject(token : Text, projectId : Text) : async Bool {
    requireAdminSession(token);
    removeProjects(projectId);
  };

  public shared func adminDeleteContact(token : Text, timestamp : Int) : async Bool {
    requireAdminSession(token);
    removeContacts(timestamp);
  };
};
