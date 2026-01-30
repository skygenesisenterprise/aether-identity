package output

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/fatih/color"
)

type Formatter interface {
	Print(format string, args ...interface{})
	Println(args ...interface{})
	Printf(format string, args ...interface{})
	PrintJSON(v interface{}) error
	Errorf(format string, args ...interface{})
	Successf(format string, args ...interface{})
	Warnf(format string, args ...interface{})
}

type TextFormatter struct {
	useColor bool
}

type JSONFormatter struct{}

func NewFormatter(outputFormat string) Formatter {
	if strings.ToLower(outputFormat) == "json" {
		return &JSONFormatter{}
	}

	useColor := true
	if _, exists := os.LookupEnv("NO_COLOR"); exists || !color.NoColor {
		useColor = false
	}

	return &TextFormatter{useColor: useColor}
}

func (f *TextFormatter) Print(format string, args ...interface{}) {
	fmt.Printf(format, args...)
}

func (f *TextFormatter) Println(args ...interface{}) {
	fmt.Println(args...)
}

func (f *TextFormatter) Printf(format string, args ...interface{}) {
	fmt.Printf(format, args...)
}

func (f *TextFormatter) PrintJSON(v interface{}) error {
	fmt.Printf("JSON output not supported in text mode\n")
	return nil
}

func (f *TextFormatter) Errorf(format string, args ...interface{}) {
	if f.useColor {
		color.Red("Error: "+format, args...)
	} else {
		fmt.Printf("Error: "+format+"\n", args...)
	}
}

func (f *TextFormatter) Successf(format string, args ...interface{}) {
	if f.useColor {
		color.Green(format, args...)
	} else {
		fmt.Printf(format+"\n", args...)
	}
}

func (f *TextFormatter) Warnf(format string, args ...interface{}) {
	if f.useColor {
		color.Yellow("Warning: "+format, args...)
	} else {
		fmt.Printf("Warning: "+format+"\n", args...)
	}
}

func (f *JSONFormatter) Print(format string, args ...interface{}) {
	fmt.Printf(format, args...)
}

func (f *JSONFormatter) Println(args ...interface{}) {
	fmt.Println(args...)
}

func (f *JSONFormatter) Printf(format string, args ...interface{}) {
	fmt.Printf(format, args...)
}

func (f *JSONFormatter) PrintJSON(v interface{}) error {
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(v)
}

func (f *JSONFormatter) Errorf(format string, args ...interface{}) {
	type errorOutput struct {
		Error string `json:"error"`
	}
	f.PrintJSON(errorOutput{Error: fmt.Sprintf(format, args...)})
}

func (f *JSONFormatter) Successf(format string, args ...interface{}) {
	type successOutput struct {
		Message string `json:"message"`
	}
	f.PrintJSON(successOutput{Message: fmt.Sprintf(format, args...)})
}

func (f *JSONFormatter) Warnf(format string, args ...interface{}) {
	type warningOutput struct {
		Warning string `json:"warning"`
	}
	f.PrintJSON(warningOutput{Warning: fmt.Sprintf(format, args...)})
}

func PrintStatus(status string, details map[string]string, formatter Formatter) {
	formatter.Successf("Status: %s", status)
	for key, value := range details {
		formatter.Printf("  %s: %s\n", key, value)
	}
}
