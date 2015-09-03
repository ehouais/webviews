timelines       = global_interval? timeline ("|" timeline)*

global_interval = "<" interval ">"

interval        = datetime "-" datetime
datetime        = date ("T" time)?

date            = ((day "/")? month "/")? year
day             = [0-3]? digit
month           = [0-1]? digit
year            = "-"? digit+

time            = hours (":" minutes (":" seconds)?)?
hours           = [0-2] digit
minutes         = [0-5] digit
seconds         = [0-5] digit

timeline        = label? event+
event           = "[" interval "]" label?
                / "[" datetime "]" label?

label           = char+
char            = [A-Za-z_]
digit           = [0-9]
